import { StoreActionApi } from "react-sweet-state";
import { ethers, Event, BigNumber, ContractReceipt } from "ethers";
import { optimisticUpdate } from "../utils";
import { Skin, MIN_DEPOSIT } from "../../constants";
import { setErrorMessage, setInfoMessage } from "./messages";
import { fetchAllEnemies } from "./enemies";

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
    doTransaction: () => fyghters.rename(myFyghterId, newName),
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
      account,
    },
  } = getState();

  const { getAddress } = ethers.utils;

  const filter = fyghters.filters.FyghterCreated(getAddress(account), null, null);
  const logs = await fyghters.queryFilter(filter, 0, "latest");
  const [myFyghterId] = logs.map((l: Event) => l.args).map(({ id }: FyghterCreated) => id);

  if (myFyghterId) {
    const myFyghter = await fyghters.fyghters(myFyghterId);
    setState({ myFyghter });
  } else {
    setState({ myFyghter: null });
  }
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
    doTransaction: () => fyghters.challenge(myFyghterId, enemyId),
    onSuccess: (receipt: ContractReceipt) => {
      const [log] = receipt.logs
        .map((log: Event) => fyghters.interface.parseLog(log))
        .filter(({ name }) => name == "ChallengeOccurred")
        .map(({ args }) => args);
      const [myFyghterId, , winnerId] = log;
      if (winnerId.eq(myFyghterId)) {
        dispatch(setInfoMessage("You won!"));
      } else {
        dispatch(setInfoMessage("You lose!"));
      }

      dispatch(fetchMyFyghter());
      // TODO: fetch only the enemy
      dispatch(fetchAllEnemies());
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
    doTransaction: async () => fyghters.create(name),
    onOptimistic: () => {
      const myFyghter: Fyghter = {
        id: null,
        skin: Skin.NAKED,
        name,
        xp: BigNumber.from("1"),
        balance: BigNumber.from("0"),
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
  setState,
  dispatch,
}: StoreApi): Promise<void> => {
  const {
    myFyghter,
    metamask: {
      account,
      contracts: { fyghters, dai },
    },
  } = getState();

  const { balance: oldBalance } = myFyghter;

  optimisticUpdate({
    doTransaction: async () => {
      // TODO: Create a button for this? (Refs: https://github.com/marcelomorgado/fyght/issues/118)
      await dai.mint(amount);

      const allowance = await dai.allowance(account, fyghters.address);
      if (allowance.lt(amount)) {
        await dai.approve(fyghters.address, amount);
      }

      return fyghters.deposit(fyghterId, amount);
    },
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, balance: amount } });
    },
    onSuccess: async () => {
      dispatch(fetchMyFyghter());
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, balance: oldBalance } });
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const withdrawAll = (fyghterId: BigNumber) => async ({
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

  const { balance: oldBalance } = myFyghter;

  optimisticUpdate({
    doTransaction: async () => fyghters.withdrawAll(fyghterId),
    onOptimistic: () => {
      setState({ myFyghter: { ...myFyghter, balance: BigNumber.from(0) } });
    },
    onSuccess: async () => {
      dispatch(fetchMyFyghter());
    },
    onError: (errorMessage: string) => {
      setState({ myFyghter: { ...myFyghter, balance: oldBalance } });
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
    doTransaction: () => fyghters.changeSkin(myFyghterId, newSkin),
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
