import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT, DEPOSIT_TO_LOOM_AMOUNT, APPROVAL_AMOUNT } from "../../constants";
import { setErrorMessage } from "./messages";
import { BigNumber } from "ethers/utils";
import { withdrawCoins } from "../../helpers/LoomUtils";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchBalances = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      loomAccount,
      ethereumAccount,
      contracts: { ethereumDai, loomDai },
    },
  } = getState();

  const ethereumAmount = ethereumAccount ? await ethereumDai.balanceOf(ethereumAccount) : new BigNumber(0);
  const loomAmount = loomAccount ? await loomDai.balanceOf(loomAccount) : new BigNumber(0);
  setState({
    daiBalances: {
      ethereumBalance: { amount: ethereumAmount, loading: false },
      loomBalance: { amount: loomAmount, loading: false },
    },
  });
};

export const mintDai = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { ethereumDai },
    },
    daiBalances,
  } = getState();

  const { ethereumBalance } = daiBalances;

  setState({ daiBalances: { ...daiBalances, ethereumBalance: { ...ethereumBalance, loading: true } } });

  optimisticUpdate({
    doTransaction: async () => ethereumDai.mint(MINT_AMOUNT),
    onSuccess: async () => {
      dispatch(fetchBalances());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const depositToLoom = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      ethereumAccount,
      loomAccount,
      contracts: { ethereumDai, ethereumGateway, loomDai, loomGateway },
    },
    daiBalances: { ethereumBalance, loomBalance },
  } = getState();

  if (ethereumBalance.amount.lt(DEPOSIT_TO_LOOM_AMOUNT)) {
    dispatch(setErrorMessage("You haven't enough balance"));
    return;
  }

  setState({
    daiBalances: {
      ethereumBalance: { ...ethereumBalance, loading: true },
      loomBalance: { ...loomBalance, loading: true },
    },
  });

  optimisticUpdate({
    doTransaction: async () => {
      const allowed: BigNumber = await ethereumDai.allowance(ethereumAccount, ethereumGateway.address);

      if (allowed.lt(DEPOSIT_TO_LOOM_AMOUNT)) {
        await ethereumDai.approve(ethereumGateway.address, APPROVAL_AMOUNT);
      }

      return await ethereumGateway.depositERC20(DEPOSIT_TO_LOOM_AMOUNT, ethereumDai.address, { gasLimit: 350000 });
    },
    onSuccess: async () => {
      const filter = loomDai.filters.Transfer(loomGateway.address, loomAccount, null);
      loomDai.once(filter, () => {
        dispatch(fetchBalances());
      });
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};

export const withdrawFromLoom = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      ethereumProvider,
      ethereumAccount,
      loomAccount,
      loomClient,
      contracts: { ethereumDai, loomDai },
    },
    daiBalances: { ethereumBalance, loomBalance },
  } = getState();

  if (ethereumBalance.amount.lt(DEPOSIT_TO_LOOM_AMOUNT)) {
    dispatch(setErrorMessage("You haven't enough balance"));
    return;
  }

  setState({
    daiBalances: {
      ethereumBalance: { ...ethereumBalance, loading: true },
      loomBalance: { ...loomBalance, loading: true },
    },
  });

  const balance = await loomDai.balanceOf(loomAccount);
  console.log(`loomDaiAddr = ${loomDai.address}`);
  console.log(`ethereumAccount = ${ethereumAccount}`);
  await withdrawCoins({
    loomClient,
    loomDai,
    loomAccountAddress: loomAccount,
    ethereumAccountAddress: ethereumAccount,
    ethereumDai,
    ethereumProvider,
    amount: balance,
  });

  dispatch(fetchBalances());

  // optimisticUpdate({
  //   doTransaction: async () => {
  //     const balance = await loomDai.balanceOf(loomAccount);
  //     // await loomDai.approve(loomGateway.address, balance);

  //     // await loomDai.withdrawERC20(loomGateway.address, balance);

  //     // const sig = "TODO: get from loomGateway event";
  //     // return await ethereumGateway.withdrawERC20(balance, sig, ethereumDai.address, {
  //     //   gasLimit: 350000,
  //     // });

  //   },
  //   onSuccess: async () => {
  //     // TODO: From .env
  //     const loomGatewayAddress = "0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D";
  //     const filter = loomDai.filters.Transfer(loomGatewayAddress, loomAccount, null);

  //     loomDai.once(filter, () => {
  //       dispatch(fetchBalances());
  //     });
  //   },
  //   onError: (errorMessage: string) => {
  //     dispatch(setErrorMessage(errorMessage));
  //   },
  //   getState,
  // });
};