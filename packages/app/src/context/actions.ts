import { ethers, ContractTransaction, Event, ContractReceipt } from "ethers";
import { BigNumber } from "ethers";
import { Skin } from "../constants";

// TODO: Move this declaration to the global.d.ts file
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

const { ethereum } = window;
if (ethereum) {
  ethereum.autoRefreshOnNetworkChange = false;
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
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";

// FIXME!
// eslint-disable-next-line no-undef
// const { FYGHTERS_CONTRACT_ADDRESS, DAI_CONTRACT_ADDRESS } = process.env;
const FYGHTERS_CONTRACT_ADDRESS = "0x45b929b8fdf5d2a04b4ff756110b3f07b954efda";
const DAI_CONTRACT_ADDRESS = "0x49de9b5f6c0dc3e22e9af986477cac01dbe82659";

interface FyghterCreated {
  owner: string;
  id: BigNumber;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createActions = (dispatch: any, state: FyghtContext): any => {
  const incrementMyFyghterXp = (): void => dispatch({ type: INCREMENT_MY_FIGHTER_XP, payload: {} });

  const incrementEnemyXp = (enemyId: BigNumber): void => dispatch({ type: INCREMENT_ENEMY_XP, payload: { enemyId } });

  const setEnemies = (enemies: Fyghter[]): void => dispatch({ type: LOAD_ENEMIES, payload: { enemies } });

  const setMyFyghter = (myFyghter: Fyghter): void => dispatch({ type: SET_MY_FYGHTER, payload: { myFyghter } });

  const setErrorMessage = (errorMessage: string): void =>
    dispatch({ type: SET_ERROR_MESSAGE, payload: { errorMessage } });

  const optimisticUpdate = async ({
    txPromise,
    onOptimistic,
    onSuccess,
    onError,
  }: {
    txPromise: Promise<ContractTransaction>;
    onOptimistic?: () => void;
    onSuccess?: (receipt?: ContractReceipt) => void;
    onError: (errorMessage: string, receipt?: ContractReceipt) => void;
  }): Promise<void> => {
    const {
      metamask: { provider },
    } = state;

    if (onOptimistic) {
      onOptimistic();
    }

    try {
      const tx: ContractTransaction = await txPromise;

      provider.once(tx.hash, (receipt: ContractReceipt) => {
        const { status } = receipt;
        if (!status) {
          onError("", receipt);
          return;
        }
        if (onSuccess) {
          onSuccess(receipt);
        }
      });
    } catch (e) {
      const errorMessage =
        e.data && e.data.message
          ? e.data.message.replace("VM Exception while processing transaction: revert ", "")
          : "Unexpected error";
      onError(errorMessage);
    }
  };

  const createFyghter = async (name: string): Promise<void> => {
    const {
      metamask: {
        contracts: { fyghters },
      },
    } = state;

    optimisticUpdate({
      txPromise: fyghters.create(name),
      onOptimistic: () => {
        const myFyghter: Fyghter = {
          id: null,
          skin: Skin.NAKED,
          name,
          xp: BigNumber.from("1"),
        };
        setMyFyghter(myFyghter);
      },
      onSuccess: async (receipt: ContractReceipt) => {
        const [log] = receipt.logs
          .map((log: Event) => fyghters.interface.parseLog(log))
          .filter(({ name }) => name == "FyghterCreated")
          .map(({ args }) => args);
        const [, id] = log;
        const myFyghter = await fyghters.fyghters(id);
        setMyFyghter(myFyghter);
      },
      onError: (errorMessage: string) => {
        setMyFyghter(null);
        setErrorMessage(errorMessage);
      },
    });
  };

  const renameMyFyghter = async (newName: string): Promise<void> => {
    const {
      myFyghter,
      metamask: {
        contracts: { fyghters },
      },
    } = state;
    const { id: myFyghterId, name: oldName } = myFyghter;

    optimisticUpdate({
      txPromise: fyghters.rename(myFyghterId, newName),
      onOptimistic: () => {
        dispatch({ type: RENAME, payload: { name: newName } });
      },
      onError: (errorMessage: string) => {
        dispatch({ type: RENAME, payload: { name: oldName } });
        setErrorMessage(errorMessage);
      },
    });
  };

  const changeMyFyghterSkin = async (newSkin: string): Promise<void> => {
    const {
      myFyghter,
      metamask: {
        contracts: { fyghters },
      },
    } = state;
    const { id: myFyghterId, skin: oldSkin } = myFyghter;

    optimisticUpdate({
      txPromise: fyghters.changeSkin(myFyghterId, newSkin),
      onOptimistic: () => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: newSkin } });
      },
      onError: (errorMessage: string) => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: oldSkin } });
        setErrorMessage(errorMessage);
      },
    });
  };

  const challengeAnEnemy = async (enemyId: BigNumber, whenFinish: () => {}): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: {
        contracts: { fyghters },
      },
    } = state;

    optimisticUpdate({
      txPromise: fyghters.challenge(myFyghterId, enemyId),
      onSuccess: (receipt: ContractReceipt) => {
        const [log] = receipt.logs
          .map((log: Event) => fyghters.interface.parseLog(log))
          .filter(({ name }) => name == "ChallengeOccurred")
          .map(({ args }) => args);
        const [myFighterId, enemyId, winnerId] = log;

        if (winnerId == myFighterId) {
          incrementMyFyghterXp();
        } else {
          incrementEnemyXp(enemyId);
        }
        whenFinish();
      },
      onError: (errorMessage: string) => {
        setErrorMessage(errorMessage);
        whenFinish();
      },
    });
  };

  const loadEnemies = async (): Promise<void> => {
    const {
      metamask: {
        contracts: { fyghters },
        provider,
        account,
      },
    } = state;

    if (!fyghters || !provider) {
      setEnemies([]);
      return;
    }

    const filter = fyghters.filters.FyghterCreated(null, null, null);
    const logs = await fyghters.queryFilter(filter, 0, "latest");

    const enemiesIds = logs
      .map((l: Event) => l.args)
      .filter(({ owner }: FyghterCreated) => getAddress(owner) !== getAddress(account))
      .map(({ id }: FyghterCreated) => id);

    const enemiesPromises = enemiesIds.map((id: BigNumber) => fyghters.fyghters(id));
    const enemies: Fyghter[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
  };

  const loadMyFyghter = async (): Promise<void> => {
    const {
      metamask: {
        contracts: { fyghters },
        account,
      },
    } = state;

    const filter = fyghters.filters.FyghterCreated(getAddress(account), null, null);
    const logs = await fyghters.queryFilter(filter, 0, "latest");
    const [myFyghterId] = logs.map((l: Event) => l.args).map(({ id }: FyghterCreated) => id);

    if (myFyghterId) {
      const myFyghter = await fyghters.fyghters(myFyghterId);
      setMyFyghter(myFyghter);
    } else {
      setMyFyghter(null);
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
      const DAI_CONTRACT_ABI = require("../contracts/Dai.json").abi;

      const fyghters = new ethers.Contract(FYGHTERS_CONTRACT_ADDRESS, FYGHTERS_CONTRACT_ABI, signer);

      const dai = new ethers.Contract(DAI_CONTRACT_ADDRESS, DAI_CONTRACT_ABI, signer);

      const [account] = await ethereum.enable();

      // TODO: It isn't working sometimes
      const { networkVersion: networkId } = ethereum;
      dispatch({
        type: INITIALIZE_METAMASK,
        payload: {
          ...metamask,
          contracts: { fyghters, dai },
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
    challengeAnEnemy,
    loadEnemies,
    loadMyFyghter,
    setMetamaskAccount,
    setMetamaskNetworkId,
    initializeMetamask,
    createFyghter,
    setErrorMessage,
  };
};
