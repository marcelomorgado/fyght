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
export const SET_ENEMIES = "SET_ENEMIES";
export const SET_MY_FYGHTER = "SET_MY_FYGHTER";
export const UPDATE_METAMASK_ACCOUNT = "UPDATE_METAMASK_ACCOUNT";
export const UPDATE_METAMASK_NETWORK = "UPDATE_METAMASK_NETWORK";
export const INITIALIZE_METAMASK = "INITIALIZE_METAMASK";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const SET_INFO_MESSAGE = "SET_INFO_MESSAGE";

// Note: Parcel doesn't support process.env es6 destructuring
//

// Refs:
// https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971
// https://en.parceljs.org/env.html

// eslint-disable-next-line no-undef
const FYGHTERS_CONTRACT_ADDRESS = process.env.FYGHTERS_CONTRACT_ADDRESS;
// eslint-disable-next-line no-undef
const DAI_CONTRACT_ADDRESS = process.env.DAI_CONTRACT_ADDRESS;

// Get from contract
const MIN_DEPOSIT = `${5e18}`;

interface FyghterCreated {
  owner: string;
  id: BigNumber;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createActions = (dispatch: any, state: FyghtContext): any => {
  const setEnemies = (enemies: Enemy[]): void => dispatch({ type: SET_ENEMIES, payload: { enemies } });

  const setMyFyghter = (myFyghter: Fyghter): void => dispatch({ type: SET_MY_FYGHTER, payload: { myFyghter } });

  const setErrorMessage = (errorMessage: string): void =>
    dispatch({ type: SET_ERROR_MESSAGE, payload: { errorMessage } });

  const setInfoMessage = (infoMessage: string): void => dispatch({ type: SET_INFO_MESSAGE, payload: { infoMessage } });

  const optimisticUpdate = async ({
    doTransaction,
    onOptimistic,
    onSuccess,
    onError,
  }: {
    doTransaction: () => Promise<ContractTransaction>;
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
      const tx: ContractTransaction = await doTransaction();

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
      console.debug(e);
      const errorMessage =
        e.data && e.data.message
          ? e.data.message.replace("VM Exception while processing transaction: revert ", "")
          : "Unexpected error";

      onError(errorMessage);
    }
  };

  const fetchMyFyghter = async (): Promise<void> => {
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
    }
  };

  const createFyghter = async (name: string): Promise<void> => {
    const {
      metamask: {
        contracts: { fyghters, dai },
      },
    } = state;

    optimisticUpdate({
      doTransaction: async () => {
        // TODO: Create a button for this? (Refs: https://github.com/marcelomorgado/fyght/issues/118)
        await dai.mint(MIN_DEPOSIT);
        // TODO: Call for approval only if needed (Refs: https://github.com/marcelomorgado/fyght/issues/118)
        await dai.approve(fyghters.address, MIN_DEPOSIT);
        return fyghters.create(name);
      },
      onOptimistic: () => {
        const myFyghter: Fyghter = {
          id: null,
          skin: Skin.NAKED,
          name,
          xp: BigNumber.from("1"),
          balance: BigNumber.from(MIN_DEPOSIT),
        };
        setMyFyghter(myFyghter);
      },
      onSuccess: async () => {
        fetchMyFyghter();
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
      doTransaction: () => fyghters.rename(myFyghterId, newName),
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
      doTransaction: () => fyghters.changeSkin(myFyghterId, newSkin),
      onOptimistic: () => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: newSkin } });
      },
      onError: (errorMessage: string) => {
        dispatch({ type: CHANGE_SKIN, payload: { skin: oldSkin } });
        setErrorMessage(errorMessage);
      },
    });
  };

  const loadEnemy = async (id: BigNumber): Promise<Enemy> => {
    const {
      metamask: {
        contracts: { fyghters },
      },
      myFyghter,
    } = state;

    const fyghter: Fyghter = await fyghters.fyghters(id);

    let winProbability = null;

    if (myFyghter && myFyghter.id) {
      const { id: myFyghterId } = myFyghter;
      winProbability = await fyghters.calculateWinProbability(myFyghterId, id);
    }
    return { fyghter, winProbability };
  };

  // TODO: To investigate will it's being called constantly
  // Put a console.log to see the issue
  // Refs: https://github.com/marcelomorgado/fyght/issues/128
  const fetchAllEnemies = async (): Promise<void> => {
    const {
      metamask: {
        contracts: { fyghters },
        provider,
        account,
      },
      myFyghter,
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

    const enemiesPromises = enemiesIds.map((id: BigNumber) => loadEnemy(id));
    const enemies: Enemy[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
  };

  const challengeAnEnemy = async (enemyId: BigNumber, whenFinish: () => {}): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: {
        contracts: { fyghters },
      },
    } = state;

    optimisticUpdate({
      doTransaction: () => fyghters.challenge(myFyghterId, enemyId),
      onSuccess: (receipt: ContractReceipt) => {
        const [log] = receipt.logs
          .map((log: Event) => fyghters.interface.parseLog(log))
          .filter(({ name }) => name == "ChallengeOccurred")
          .map(({ args }) => args);
        const [myFyghterId, , winnerId] = log;
        if (winnerId.eq(myFyghterId)) {
          setInfoMessage("You won!");
        } else {
          setInfoMessage("You lose!");
        }

        fetchMyFyghter();
        // TODO: fetch only the enemy
        fetchAllEnemies();
        whenFinish();
      },
      onError: (errorMessage: string) => {
        setErrorMessage(errorMessage);
        whenFinish();
      },
    });
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
    fetchAllEnemies,
    fetchMyFyghter,
    setMetamaskAccount,
    setMetamaskNetworkId,
    initializeMetamask,
    createFyghter,
    setErrorMessage,
    setInfoMessage,
  };
};
