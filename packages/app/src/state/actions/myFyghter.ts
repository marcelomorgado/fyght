import { StoreActionApi } from "react-sweet-state";
import { ethers, Event } from "ethers";
import { optimisticUpdate } from "../utils";
import { Skin, APPROVAL_AMOUNT } from "../../constants";
import { setErrorMessage, setInfoMessage } from "./messages";
import { fetchEnemy } from "./enemies";
import { fetchBalances, setDaiBalancesLoading } from "./daiBalances";
import { TransactionReceipt } from "ethers/providers";
import { BigNumber } from "ethers/utils";
import Fyghters from "../../contracts/Fyghters.json";

// eslint-disable-next-line no-undef
const LOOM_NETWORK_ID = process.env.LOOM_NETWORK_ID;

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const setMyFyghterBalanceLoading = (loading: boolean) => async ({
  getState,
  setState,
}: StoreApi): Promise<void> => {
  const { myFyghter } = getState();
  const { balance } = myFyghter;
  setState({ myFyghter: { ...myFyghter, balance: { ...balance, loading } } });
};

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
      loomProvider,
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
  } = Fyghters as ContractJson;

  const { blockNumber: from } = await loomProvider.getTransactionReceipt(transactionHash);
  const to = await loomProvider.getBlockNumber();

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
          await loomProvider.getLogs({
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
  const { balance: amount } = myFyghter;
  setState({ myFyghter: { ...myFyghter, balance: { amount, loading: false } } });
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

  dispatch(setMyFyghterBalanceLoading(true));

  optimisticUpdate({
    doTransaction: () => fyghters.challenge(myFyghterId, enemyId, { gasLimit: 0 }),
    onSuccess: (receipt: TransactionReceipt) => {
      dispatch(setMyFyghterBalanceLoading(false));
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
      dispatch(fetchEnemy(enemyId));
      dispatch(fetchBalances());
      whenFinish();
    },
    onError: (errorMessage: string) => {
      dispatch(setMyFyghterBalanceLoading(false));
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
        xp: new BigNumber("1"),
        balance: { amount: new BigNumber("0"), loading: false },
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

  dispatch(setMyFyghterBalanceLoading(true));
  dispatch(setDaiBalancesLoading({ loomDaiLoading: true }));

  optimisticUpdate({
    doTransaction: async () => {
      const allowed: BigNumber = await loomDai.allowance(account, fyghters.address);

      if (allowed.lt(amount)) {
        await loomDai.approve(fyghters.address, APPROVAL_AMOUNT, { gasLimit: 0 });
      }

      return fyghters.deposit(fyghterId, amount, { gasLimit: 0 });
    },
    onSuccess: async () => {
      dispatch(setMyFyghterBalanceLoading(false));
      dispatch(setDaiBalancesLoading({ loomDaiLoading: false }));

      dispatch(fetchMyFyghter());
      dispatch(fetchBalances());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));

      dispatch(setMyFyghterBalanceLoading(false));
      dispatch(setDaiBalancesLoading({ loomDaiLoading: false }));
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

  dispatch(setMyFyghterBalanceLoading(true));
  dispatch(setDaiBalancesLoading({ loomDaiLoading: true }));

  optimisticUpdate({
    doTransaction: async () => fyghters.withdrawAll(fyghterId, { gasLimit: 0 }),

    onSuccess: async () => {
      dispatch(setMyFyghterBalanceLoading(false));
      dispatch(setDaiBalancesLoading({ loomDaiLoading: false }));

      dispatch(fetchMyFyghter());
      dispatch(fetchBalances());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));

      dispatch(setMyFyghterBalanceLoading(false));
      dispatch(setDaiBalancesLoading({ loomDaiLoading: false }));
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
