import { ethers, ContractTransaction } from "ethers";
import { BigNumber } from "ethers/utils";
import { getAllEvents } from "../helpers";
import { TransactionReceipt } from "ethers/providers";

export const RENAME = "RENAME";
export const CHANGE_SKIN = "CHANGE_SKIN";
export const INCREMENT_MY_FIGHTER_XP = "INCREMENT_MY_FIGHTER_XP";
export const INCREMENT_ENEMY_XP = "INCREMENT_ENEMY_XP";
export const LOAD_ENEMIES = "LOAD_ENEMIES";
export const CREATE_FYGHTER = "CREATE_FYGHTER";
export const UPDATE_METAMASK_ACCOUNT = "UPDATE_METAMASK_ACCOUNT";
export const UPDATE_METAMASK_NETWORK = "UPDATE_METAMASK_NETWORK";
export const INITIALIZE_METAMASK = "INITIALIZE_METAMASK";

export const createActions = (dispatch: any, state: FyghtContext): any => {
  const createFyghter = async (name: string): Promise<void> => {
    const {
      metamask: { contract: fyghters },
    } = state;

    try {
      const tx: ContractTransaction = await fyghters.create(name);
      await tx.wait();

      // TODO: Get event from transaction
      const filter = fyghters.filters.NewFyghter(null, null, null);
      fyghters.on(filter, async (owner: string, id: number, name: string) => {
        const myFyghter = await fyghters.fyghters(id);
        dispatch({ type: CREATE_FYGHTER, payload: { myFyghter } });
      });
    } catch (e) {
      console.log(e);
      // Revert message
      //console.log(e.data.message);
    }
  };

  const renameMyFyghter = async (name: string): void => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters },
    } = state;

    try {
      const tx: ContractTransaction = await fyghters.rename(myFyghterId, name);
      await tx.wait();

      // TODO: Wait for event to update store
      dispatch({ type: RENAME, payload: { name } });
    } catch (e) {
      console.log(e);
    }
  };

  const changeMyFyghterSkin = async (skin: string): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters, provider },
    } = state;

    try {
      const tx: ContractTransaction = await fyghters.changeSkin(
        myFyghterId,
        skin
      );
      await tx.wait();
      const r: TransactionReceipt = await provider.getTransactionReceipt(
        tx.hash
      );

      if (r.status == 1) {
        dispatch({ type: CHANGE_SKIN, payload: { skin } });
      } else {
        // TODO: Create a global message component
        // setErrorMessage("Unexpected error.");
      }
    } catch (e) {
      console.log(e);

      if (e && e.data && e.data.message) {
        // TODO: Is it possible to get error without exception?
        // TODO: Create a global message component
        // setErrorMessage(e.data.message);
      }
    }
  };

  const incrementMyFyghterXp = (): void =>
    dispatch({ type: INCREMENT_MY_FIGHTER_XP, payload: {} });

  const incrementEnemyXp = (enemyId: BigNumber): void =>
    dispatch({ type: INCREMENT_ENEMY_XP, payload: { enemyId } });

  const setEnemies = (enemies: Fyghter[]): void =>
    dispatch({ type: LOAD_ENEMIES, payload: { enemies } });

  const attackAnEnemy = async (enemyId: BigNumber): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters },
    } = state;

    try {
      const tx: ContractTransaction = await fyghters.attack(
        myFyghterId,
        enemyId
      );
      await tx.wait();

      // TODO: Get event from transaction
      // TODO: Fix many events reading
      const filter = fyghters.filters.Attack(null, null, null);
      fyghters.on(
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
    } catch (e) {
      console.log(e);
    }
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

    const topic = ethers.utils.id("NewFyghter(address,uint256,string)");
    const events = await getAllEvents(fyghters, topic);
    const enemiesIds = events
      .filter(
        (event: any) =>
          ethers.utils.getAddress(event.owner) !==
          ethers.utils.getAddress(account)
      )
      .map((event: any) => event.id);

    const enemiesPromises = enemiesIds.map(id => fyghters.fyghters(id));
    const enemies: Fyghter[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
  };

  const loadMyFyghter = async (): Promise<void> => {
    const {
      metamask: { contract: fyghters, account },
    } = state;

    const topic = ethers.utils.id("NewFyghter(address,uint256,string)");
    const events = await getAllEvents(fyghters, topic);
    const [myFyghterId] = events
      .filter(
        (event: any) =>
          ethers.utils.getAddress(event.owner) ===
          ethers.utils.getAddress(account)
      )
      .map((event: any) => event.id);

    if (myFyghterId) {
      const myFyghter = await fyghters.fyghters(myFyghterId);
      createFyghter(myFyghter);
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
