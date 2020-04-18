import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT, DEPOSIT_TO_LOOM_AMOUNT, APPROVAL_AMOUNT } from "../../constants";
import { setErrorMessage, setInfoMessage } from "./messages";
import { BigNumber } from "ethers/utils";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const setDaiBalancesLoading = ({
  ethereumDaiLoading,
  loomDaiLoading,
}: {
  ethereumDaiLoading?: boolean;
  loomDaiLoading?: boolean;
}) => async ({ setState, getState }: StoreApi): Promise<void> => {
  if (ethereumDaiLoading !== undefined) {
    const {
      daiBalances: { ethereumBalance, loomBalance },
    } = getState();

    setState({
      daiBalances: {
        ethereumBalance: { ...ethereumBalance, loading: ethereumDaiLoading },
        loomBalance,
      },
    });
  }

  if (loomDaiLoading !== undefined) {
    const {
      daiBalances: { ethereumBalance, loomBalance },
    } = getState();

    setState({
      daiBalances: {
        ethereumBalance,
        loomBalance: { ...loomBalance, loading: loomDaiLoading },
      },
    });
  }
};

export const fetchBalances = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    daiBalances: { ethereumBalance, loomBalance },
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
      ethereumBalance: { ...ethereumBalance, amount: ethereumAmount },
      loomBalance: { ...loomBalance, amount: loomAmount },
    },
  });
};

export const mintDai = () => async ({ getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { ethereumDai },
    },
  } = getState();

  dispatch(setDaiBalancesLoading({ ethereumDaiLoading: true }));

  optimisticUpdate({
    doTransaction: async () => ethereumDai.mint(MINT_AMOUNT),
    onSuccess: async () => {
      dispatch(setDaiBalancesLoading({ ethereumDaiLoading: false }));
      dispatch(fetchBalances());
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
      dispatch(setDaiBalancesLoading({ ethereumDaiLoading: false }));
    },
    getState,
  });
};

export const depositToLoom = () => async ({ getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      ethereumAccount,
      loomAccount,
      contracts: { ethereumDai, ethereumGateway, loomDai, loomGateway },
    },
    daiBalances: { ethereumBalance },
  } = getState();

  if (ethereumBalance.amount.lt(DEPOSIT_TO_LOOM_AMOUNT)) {
    dispatch(setErrorMessage("You haven't enough balance"));
    return;
  }

  dispatch(setInfoMessage("This deposit process will take a few minutes to complete."));

  dispatch(setDaiBalancesLoading({ ethereumDaiLoading: true, loomDaiLoading: true }));

  optimisticUpdate({
    doTransaction: async () => {
      const allowed: BigNumber = await ethereumDai.allowance(ethereumAccount, ethereumGateway.address);

      if (allowed.lt(DEPOSIT_TO_LOOM_AMOUNT)) {
        await ethereumDai.approve(ethereumGateway.address, APPROVAL_AMOUNT);
      }

      return await ethereumGateway.depositERC20(DEPOSIT_TO_LOOM_AMOUNT, ethereumDai.address, { gasLimit: 350000 });
    },
    onSuccess: async () => {
      dispatch(setDaiBalancesLoading({ ethereumDaiLoading: false }));
      dispatch(fetchBalances());

      const filter = loomDai.filters.Transfer(loomGateway.address, loomAccount, null);
      loomDai.once(filter, () => {
        dispatch(setDaiBalancesLoading({ loomDaiLoading: false }));
        dispatch(fetchBalances());
      });
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
      dispatch(setDaiBalancesLoading({ ethereumDaiLoading: false, loomDaiLoading: false }));
    },
    getState,
  });
};

export const withdrawFromLoom = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  // TODO
};
