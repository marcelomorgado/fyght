import {
  ethers,
  ContractTransaction,
  Event,
  Transaction,
  ContractReceipt,
  Contract,
} from "ethers";
import { BigNumber } from "ethers";

const { getAddress } = ethers.utils;

export const RENAME = "RENAME";
export const CHANGE_SKIN = "CHANGE_SKIN";
export const INCREMENT_MY_FIGHTER_XP = "INCREMENT_MY_FIGHTER_XP";
export const INCREMENT_ENEMY_XP = "INCREMENT_ENEMY_XP";
export const LOAD_ENEMIES = "LOAD_ENEMIES";
export const SET_MY_FYGHTER = "SET_MY_FYGHTER";
export const UPDATE_METAMASK_ACCOUNT = "UPDATE_METAMASK_ACCOUNT";
export const UPDATE_METAMASK_NETWORK = "UPDATE_METAMASK_NETWORK";
export const INITIALIZE_METAMASK = "INITIALIZE_METAMASK";

interface NewFyghter {
  owner: string;
  id: BigNumber;
  name: string;
}

export const createActions = (dispatch: any, state: FyghtContext): any => {
  const incrementMyFyghterXp = (): void =>
    dispatch({ type: INCREMENT_MY_FIGHTER_XP, payload: {} });

  const incrementEnemyXp = (enemyId: BigNumber): void =>
    dispatch({ type: INCREMENT_ENEMY_XP, payload: { enemyId } });

  const setEnemies = (enemies: Fyghter[]): void =>
    dispatch({ type: LOAD_ENEMIES, payload: { enemies } });

  const setMyFyghter = (myFyghter: Fyghter): void =>
    dispatch({ type: SET_MY_FYGHTER, payload: { myFyghter } });

  const createFyghter = async (name: string): Promise<void> => {
    const {
      metamask: { contract: fyghters },
    } = state;

    try {
      const tx: ContractTransaction = await fyghters.create(name);
      await tx.wait();
      console.log(tx);

      // TODO: Get event from transaction
      const filter = fyghters.filters.NewFyghter(null, null, null);
      fyghters.on(filter, async (owner: string, id: number, name: string) => {
        const myFyghter = await fyghters.fyghters(id);
        setMyFyghter(myFyghter);
      });
    } catch (e) {
      console.log(e);
      // Revert message
      //console.log(e.data.message);
    }
  };

  const optimisticUpdate = async (
    tx: Transaction,
    onSuccess: () => void,
    onError: () => void
  ): Promise<void> => {
    const {
      metamask: { provider },
    } = state;

    // Optimistic update
    onSuccess();

    provider.once(tx.hash, (receipt: ContractReceipt) => {
      const { status } = receipt;
      if (!status) {
        onError();
      }
    });
  };

  const renameMyFyghter = async (newName: string): void => {
    const {
      myFyghter,
      metamask: { contract: fyghters },
    } = state;
    const { id: myFyghterId, name: oldName } = myFyghter;

    const tx: ContractTransaction = await fyghters.rename(myFyghterId, newName);

    optimisticUpdate(
      tx,
      () => {
        dispatch({ type: RENAME, payload: { name: newName } });
      },
      () => {
        dispatch({ type: RENAME, payload: { name: oldName } });
      }
    );
  };

  const changeMyFyghterSkin = async (newSkin: string): Promise<void> => {
    const {
      myFyghter,
      metamask: { contract: fyghters },
    } = state;
    const { id: myFyghterId, skin: oldSkin } = myFyghter;

    const tx: ContractTransaction = await fyghters.changeSkin(
      myFyghterId,
      newSkin
    );

    optimisticUpdate(
      tx,
      () => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: newSkin } });
      },
      () => {
        dispatch({ type: RENAME, payload: { name: oldSkin } });
      }
    );
  };

  const attackAnEnemy = async (enemyId: BigNumber): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters, provider },
    } = state;

    const tx: ContractTransaction = await fyghters.attack(myFyghterId, enemyId);

    provider.once(tx.hash, ({ status }: ContractReceipt) => {
      if (!status) {
        // TODO: Error message
      }
    });

    const filter = fyghters.filters.Attack(myFyghterId, null, null);
    fyghters.once(
      filter,
      async (
        myFighterId: BigNumber,
        enemyId: BigNumber,
        winnerId: BigNumber
      ) => {
        if (winnerId.eq(myFighterId)) {
          incrementMyFyghterXp();
        } else {
          incrementEnemyXp(enemyId);
        }
      }
    );
  };

  //
  // Note: This low level code needed to get past events is the way that ethers.js v4 works
  // See more: https://github.com/marcelomorgado/fyght/issues/78
  //
  const loadEnemies = async (): Promise<void> => {
    const {
      metamask: { contract: fyghters, provider, account },
    } = state;

    if (!fyghters || !provider) {
      setEnemies([]);
      return;
    }

    const filter = fyghters.filters.NewFyghter(null, null, null);
    const logs = await fyghters.queryFilter(filter, 0, "latest");
    const enemiesIds = logs
      .map((l: Event) => l.args)
      .filter(
        ({ owner }: NewFyghter) => getAddress(owner) !== getAddress(account)
      )
      .map(({ id }: NewFyghter) => id);

    const enemiesPromises = enemiesIds.map((id: BigNumber) =>
      fyghters.fyghters(id)
    );
    const enemies: Fyghter[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
  };

  const loadMyFyghter = async (): Promise<void> => {
    const {
      metamask: { contract: fyghters, account },
    } = state;

    const filter = fyghters.filters.NewFyghter(getAddress(account), null, null);
    const logs = await fyghters.queryFilter(filter, 0, "latest");
    const [myFyghterId] = logs
      .map((l: Event) => l.args)
      .map(({ id }: NewFyghter) => id);

    if (myFyghterId) {
      const myFyghter = await fyghters.fyghters(myFyghterId);
      setMyFyghter(myFyghter);
    }
  };

  const setMetamaskAccount = (account: string): void =>
    dispatch({ type: UPDATE_METAMASK_ACCOUNT, payload: { account } });

  const setMetamaskNetworkId = (networkId: number): void =>
    dispatch({ type: UPDATE_METAMASK_NETWORK, payload: { networkId } });

  const initializeMetamask = (): void => {
    const {
      metamask: { ethereum },
    } = state;

    if (ethereum) {
      // Note: The metamask docs recommends to use the 'chainChanged' event instead but it isn't working
      // See more: https://docs.metamask.io/guide/ethereum-provider.html#methods-new-api
      ethereum.on("networkChanged", (networkId: number) => {
        setMetamaskNetworkId(networkId);
      });

      ethereum.on("accountsChanged", ([account]: string[]) => {
        setMetamaskAccount(account);
      });
    }

    dispatch({ type: INITIALIZE_METAMASK, payload: {} });
  };

  return {
    renameMyFyghter,
    changeMyFyghterSkin,
    attackAnEnemy,
    loadEnemies,
    loadMyFyghter,
    setMetamaskAccount,
    setMetamaskNetworkId,
    initializeMetamask,
    createFyghter,
  };
};
