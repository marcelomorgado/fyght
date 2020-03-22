import { StoreActionApi } from "react-sweet-state";
import { ethers, Event, ContractReceipt, BigNumber } from "ethers";
import { optimisticUpdate } from "./utils";
import { Skin, MIN_DEPOSIT } from "../constants";
const { getAddress } = ethers.utils;

type State = FyghtContext;
type StoreApi = StoreActionApi<State>;

export const fetchMyFyghter = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
      account,
    },
  } = getState();

  const filter = fyghters.filters.FyghterCreated(getAddress(account), null, null);
  const logs = await fyghters.queryFilter(filter, 0, "latest");
  const [myFyghterId] = logs.map((l: Event) => l.args).map(({ id }: FyghterCreated) => id);

  if (myFyghterId) {
    const myFyghter = await fyghters.fyghters(myFyghterId);
    setState({ myFyghter });
  }
};

export const fetchAllEnemies = () => async ({ setState, getState }: StoreApi) => {
  const {
    metamask: {
      contracts: { fyghters },
      provider,
      account,
    },
    myFyghter,
  } = getState();

  if (!fyghters || !provider) {
    setState({ enemies: [] });
    return;
  }

  const loadEnemy = async (id: BigNumber): Promise<Enemy> => {
    const fyghter: Fyghter = await fyghters.fyghters(id);

    let winProbability = null;

    if (myFyghter && myFyghter.id) {
      const { id: myFyghterId } = myFyghter;
      winProbability = await fyghters.calculateWinProbability(myFyghterId, id);
    }
    return { fyghter, winProbability };
  };

  const filter = fyghters.filters.FyghterCreated(null, null, null);
  const logs = await fyghters.queryFilter(filter, 0, "latest");

  const enemiesIds = logs
    .map((l: Event) => l.args)
    .filter(({ owner }: FyghterCreated) => getAddress(owner) !== getAddress(account))
    .map(({ id }: FyghterCreated) => id);

  const enemiesPromises = enemiesIds.map((id: BigNumber) => loadEnemy(id));
  const enemies: Enemy[] = await Promise.all(enemiesPromises);

  setState({ enemies });
};

export const setErrorMessage = (errorMessage: string) => ({ setState, getState }: StoreApi): void => {
  const { messages } = getState();
  setState({ messages: { ...messages, errorMessage } });
};

export const setInfoMessage = (infoMessage: string) => ({ setState, getState }: StoreApi): void => {
  const { messages } = getState();
  setState({ messages: { ...messages, infoMessage } });
};

export const renameMyFyghter = (newName: string) => async ({ getState, setState }: StoreApi): Promise<void> => {
  const {
    myFyghter,
    metamask: {
      contracts: { fyghters },
    },
  } = getState();
  const { id: myFyghterId, name: oldName } = myFyghter;

  optimisticUpdate({
    doTransaction: () => fyghters.rename(myFyghterId, newName),
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, name: newName } });
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, name: oldName } });
      setErrorMessage(errorMessage);
    },
    getState,
  });
};

export const createFyghter = (name: string) => async ({ getState, setState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters, dai },
    },
  } = getState();

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
      setState({ myFyghter });
    },
    onSuccess: async () => {
      dispatch(fetchMyFyghter());
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: null });
      setErrorMessage(errorMessage);
    },
    getState,
  });
};

export const changeMyFyghterSkin = (newSkin: string) => async ({ getState, setState }: StoreApi): Promise<void> => {
  const {
    myFyghter,
    metamask: {
      contracts: { fyghters },
    },
  } = getState();
  const { id: myFyghterId, skin: oldSkin } = myFyghter;

  optimisticUpdate({
    doTransaction: () => fyghters.changeSkin(myFyghterId, newSkin),
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, skin: newSkin } });
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, skin: oldSkin } });
      setErrorMessage(errorMessage);
    },
    getState,
  });
};

export const challengeAnEnemy = (enemyId: BigNumber, whenFinish: () => void) => async ({
  getState,
}: StoreApi): Promise<void> => {
  const {
    myFyghter: { id: myFyghterId },
    metamask: {
      contracts: { fyghters },
    },
  } = getState();

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
    getState,
  });
};

const setMetamaskNetworkId = (networkId: number) => ({ setState, getState }: StoreApi) => {
  const { metamask } = getState();
  setState({ metamask: { ...metamask, networkId } });
};

export const setMetamaskAccount = (account: string) => ({ setState, getState }: StoreApi) => {
  const { metamask } = getState();
  setState({ metamask: { ...metamask, account } });
};

export const initializeMetamask = () => async ({ setState, getState, dispatch }: StoreApi) => {
  const { metamask } = getState();

  const { ethereum } = window;
  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
  }
  // Note: Parcel doesn't support process.env es6 destructuring
  //

  // Refs:
  // https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971
  // https://en.parceljs.org/env.html

  // eslint-disable-next-line no-undef
  const FYGHTERS_CONTRACT_ADDRESS = process.env.FYGHTERS_CONTRACT_ADDRESS;
  // eslint-disable-next-line no-undef
  const DAI_CONTRACT_ADDRESS = process.env.DAI_CONTRACT_ADDRESS;

  if (ethereum) {
    // Note: The metamask docs recommends to use the 'chainChanged' event instead but it isn't working
    // See more: https://docs.metamask.io/guide/ethereum-provider.html#methods-new-api
    ethereum.on("networkChanged", (networkId: number) => {
      dispatch(setMetamaskNetworkId(networkId));
    });

    ethereum.on("accountsChanged", ([account]: string[]) => {
      dispatch(setMetamaskAccount(account));
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
    setState({
      metamask: {
        ...metamask,
        contracts: { fyghters, dai },
        ethereum,
        account,
        provider,
        networkId,
        loading: false,
      },
    });
  }
};
