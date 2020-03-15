import {
  ethers,
  ContractTransaction,
  Event,
  Transaction,
  ContractReceipt,
} from "ethers";
import { BigNumber } from "ethers";
import { Skin } from "../constants";

// TODO: Move this declaration to the global.d.ts file
declare global {
  interface Window {
    // TODO: Set properly type
    ethereum: any;
  }
}

const { ethereum } = window;
if (ethereum) {
  // ethereum.autoRefreshOnNetworkChange = false;
}

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

// eslint-disable-next-line no-undef
const { FYGHTERS_CONTRACT_ADDRESS } = process.env;

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

  const optimisticUpdate = async ({
    tx,
    onOptimistic,
    onSuccess,
    onError,
  }: {
    tx: Transaction;
    onOptimistic?: () => void;
    onSuccess?: (receipt?: ContractReceipt) => void;
    onError: () => void;
  }): Promise<void> => {
    const {
      metamask: { provider },
    } = state;

    if (onOptimistic) {
      onOptimistic();
    }

    provider.once(tx.hash, (receipt: ContractReceipt) => {
      const { status } = receipt;
      if (!status) {
        onError();
        return;
      }
      if (onSuccess) {
        onSuccess(receipt);
      }
    });
  };

  const createFyghter = async (name: string): Promise<void> => {
    const {
      metamask: { contract: fyghters },
    } = state;

    const tx: ContractTransaction = await fyghters.create(name);

    optimisticUpdate({
      tx,
      onOptimistic: () => {
        const myFyghter: Fyghter = {
          id: null,
          skin: Skin.NAKED,
          name,
          xp: BigNumber.from("1"),
        };
        // setMyFyghter(myFyghter);
      },
      onSuccess: async (receipt: ContractReceipt) => {
        const [log] = receipt.logs
          .map((log: Event) => fyghters.interface.parseLog(log))
          .filter(({ name }) => name == "Attack")
          .map(({ args }) => args);
        const [owner, id, name] = log;
        const myFyghter = await fyghters.fyghters(id);
        setMyFyghter(myFyghter);
      },
      onError: () => {
        setMyFyghter(null);
        // TODO: Error message
      },
    });
  };

  const renameMyFyghter = async (newName: string): void => {
    const {
      myFyghter,
      metamask: { contract: fyghters },
    } = state;
    const { id: myFyghterId, name: oldName } = myFyghter;

    const tx: ContractTransaction = await fyghters.rename(myFyghterId, newName);

    optimisticUpdate({
      tx,
      onOptimistic: () => {
        dispatch({ type: RENAME, payload: { name: newName } });
      },
      onError: () => {
        dispatch({ type: RENAME, payload: { name: oldName } });
      },
    });
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

    optimisticUpdate({
      tx,
      onOptimistic: () => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: newSkin } });
      },
      onError: () => {
        dispatch({ type: RENAME, payload: { name: oldSkin } });
        // TODO: Error mesage with reason
      },
    });
  };

  const attackAnEnemy = async (enemyId: BigNumber): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters },
    } = state;

    const tx: ContractTransaction = await fyghters.attack(myFyghterId, enemyId);

    optimisticUpdate({
      tx,
      onOptimistic: () => {},
      onSuccess: (receipt: ContractReceipt) => {
        const [log] = receipt.logs
          .map((log: Event) => fyghters.interface.parseLog(log))
          .filter(({ name }) => name == "Attack")
          .map(({ args }) => args);
        const [myFighterId, enemyId, winnerId] = log;

        if (winnerId.eq(myFighterId)) {
          incrementMyFyghterXp();
        } else {
          incrementEnemyXp(enemyId);
        }
      },
      onError: () => {
        // TODO: Error message
      },
    });
  };

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

  const initializeMetamask = async (): Promise<void> => {
    const { metamask } = state;

    if (ethereum) {
      // Note: The metamask docs recommends to use the 'chainChanged' event instead but it isn't working
      // See more: https://docs.metamask.io/guide/ethereum-provider.html#methods-new-api
      ethereum.on("networkChanged", (networkId: number) => {
        setMetamaskNetworkId(networkId);
      });

      ethereum.on("accountsChanged", ([account]: string[]) => {
        setMetamaskAccount(account);
      });

      const provider = new ethers.providers.Web3Provider(ethereum);

      const signer = provider.getSigner();
      const FYGHTERS_CONTRACT_ABI = require("../contracts/Fyghters.json").abi;
      const contract = new ethers.Contract(
        FYGHTERS_CONTRACT_ADDRESS,
        FYGHTERS_CONTRACT_ABI,
        signer
      );

      const [account] = await ethereum.enable();

      const { networkVersion: networkId } = ethereum;
      dispatch({
        type: INITIALIZE_METAMASK,
        payload: {
          ...metamask,
          contract,
          ethereum,
          account,
          provider,
          networkId,
        },
      });
    }
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
