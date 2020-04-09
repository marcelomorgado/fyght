import { StoreActionApi } from "react-sweet-state";
import { ethers, Event } from "ethers";
import { optimisticUpdate } from "../utils";
import { Skin } from "../../constants";
import { setErrorMessage, setInfoMessage } from "./messages";
import { fetchAllEnemies } from "./enemies";
import { fetchBalance } from "./balance";
import { TransactionReceipt } from "ethers/providers";
import { BigNumber } from "ethers/utils";
import Fyghters from "../../contracts/Fyghters.json";

// eslint-disable-next-line no-undef
const LOOM_NETWORK_ID = process.env.LOOM_NETWORK_ID;

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const renameMyFyghter = (newName: string) => async ({
  getState,
  setState,
  dispatch,
}: StoreApi): Promise<void> => {
  const {
    myFyghter,
    metamask: {
      contracts: { fyghters },
    },
  } = getState();
  const { id: myFyghterId, name: oldName } = myFyghter;

  optimisticUpdate({
    doTransaction: () => fyghters.rename(myFyghterId, newName, { gasLimit: 0 }),
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, name: newName } });
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, name: oldName } });
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const fetchMyFyghter = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
      loomAccount: account,
      provider,
    },
  } = getState();

  const { getAddress } = ethers.utils;

  if (!account) {
    setState({ myFyghter: null });
    return;
  }

  const {
    networks: {
      [LOOM_NETWORK_ID]: { transactionHash },
    },
  } = Fyghters;

  const { blockNumber: from } = await provider.getTransactionReceipt(transactionHash);
  const to = await provider.getBlockNumber();

  const toScan = to - from;
  const maxBlocksPerQuery = 100;
  const numberOfQueries = Math.ceil(toScan / maxBlocksPerQuery);
  const queries = [...Array(numberOfQueries)].map((k, i) => [
    from + i * maxBlocksPerQuery,
    from + (i + 1) * maxBlocksPerQuery - 1,
  ]);

  //
  // Ethers v5
  //
  // const filter = fyghters.filters.FyghterCreated(getAddress(account), null, null);
  // const logs = (
  //   await Promise.all(queries.map(async ([from, to]) => await fyghters.queryFilter(filter, from, to)))
  // ).reduce((a, b) => [...a, ...b], []);
  // const [myFyghterId] = logs.map((l: Event) => l.args).map(({ id }: FyghterCreated) => id);

  //
  // Ethers v4
  //
  const event = fyghters.interface.events["FyghterCreated"];
  const topic = event.topic;
  const logs = (
    await Promise.all(
      queries.map(
        async ([from, to]) =>
          await provider.getLogs({
            address: fyghters.address,
            fromBlock: from,
            toBlock: to,
            topics: [topic],
          })
      )
    )
  ).reduce((a, b) => [...a, ...b], []);
  const [myFyghterId] = logs
    .map((log: Event) => event.decode(log.data, log.topics))
    .filter(({ owner }: { owner: string }) => getAddress(owner) === getAddress(account))
    .map(({ id }: { id: BigNumber }) => id);

  if (!myFyghterId) {
    setState({ myFyghter: null });
    return;
  }

  const myFyghter = await fyghters.fyghters(myFyghterId);
  setState({ myFyghter });
};

export const challengeAnEnemy = (enemyId: BigNumber, whenFinish: () => void) => async ({
  getState,
  dispatch,
}: StoreApi): Promise<void> => {
  const {
    myFyghter: { id: myFyghterId },
    metamask: {
      contracts: { fyghters },
    },
  } = getState();

  optimisticUpdate({
    doTransaction: () => fyghters.challenge(myFyghterId, enemyId, { gasLimit: 0 }),
    onSuccess: (receipt: TransactionReceipt) => {
      console.log(receipt);

      //
      // Ethers v5
      //
      // const [log] = receipt.logs
      //   .map((log: Event) => fyghters.interface.parseLog(log))
      //   .filter(({ name }) => name == "ChallengeOccurred")
      //   .map(({ args }) => args);
      // const [myFyghterId, , winnerId] = log;

      //
      // Ethers v4
      //
      const event = fyghters.interface.events["ChallengeOccurred"];
      const logs = receipt.logs.map((log: Event) => event.decode(log.data, log.topics));
      const [challengeOcurred] = logs;
      const { winnerId, challengerId: myFyghterId } = challengeOcurred;

      if (winnerId.eq(myFyghterId)) {
        dispatch(setInfoMessage("You won!"));
      } else {
        dispatch(setInfoMessage("You lose!"));
      }

      dispatch(fetchMyFyghter());
      // TODO: fetch only the target enemy
      dispatch(fetchAllEnemies());
      dispatch(fetchBalance());
      whenFinish();
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
      whenFinish();
    },
    getState,
  });
};

export const createFyghter = (name: string) => async ({ getState, setState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
    },
  } = getState();

  optimisticUpdate({
    doTransaction: async () => fyghters.create(name, { gasLimit: 0 }),
    onOptimistic: () => {
      const myFyghter: Fyghter = {
        id: null,
        skin: Skin.NAKED,
        name,
        xp: "1",
        balance: "0",
      };
      setState({ myFyghter });
    },
    onSuccess: async () => {
      dispatch(fetchMyFyghter());
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: null });
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const doDeposit = (fyghterId: BigNumber, amount: BigNumber) => async ({
  getState,
  dispatch,
}: StoreApi): Promise<void> => {
  const {
    metamask: {
      loomAccount: account,
      contracts: { fyghters, loomDai },
    },
  } = getState();

  optimisticUpdate({
    doTransaction: async () => {
      const allowance = await loomDai.allowance(account, fyghters.address);
      if (allowance.lt(amount)) {
        await loomDai.approve(fyghters.address, amount, { gasLimit: 0 });
      }

      return fyghters.deposit(fyghterId, amount, { gasLimit: 0 });
    },
    onSuccess: async () => {
      dispatch(fetchMyFyghter());
      dispatch(fetchBalance());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const withdrawAll = (fyghterId: BigNumber) => async ({ getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
    },
  } = getState();

  optimisticUpdate({
    doTransaction: async () => fyghters.withdrawAll(fyghterId, { gasLimit: 0 }),

    onSuccess: async () => {
      dispatch(fetchMyFyghter());
      dispatch(fetchBalance());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const changeMyFyghterSkin = (newSkin: string) => async ({
  getState,
  setState,
  dispatch,
}: StoreApi): Promise<void> => {
  const {
    myFyghter,
    metamask: {
      contracts: { fyghters },
    },
  } = getState();
  const { id: myFyghterId, skin: oldSkin } = myFyghter;

  optimisticUpdate({
    doTransaction: () => fyghters.changeSkin(myFyghterId, newSkin, { gasLimit: 0 }),
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, skin: newSkin } });
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, skin: oldSkin } });
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};
