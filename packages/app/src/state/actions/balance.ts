import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT } from "../../constants";
import { setErrorMessage } from "./messages";
import { BigNumber } from "ethers";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchBalance = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      account,
      contracts: { dai },
    },
  } = getState();

  const amount = await dai.balanceOf(account);
  setState({ balance: { amount, loading: false } });
};

export const mintDai = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { dai },
    },
    balance,
  } = getState();

  setState({ balance: { ...balance, loading: true } });

  optimisticUpdate({
    doTransaction: async () => dai.mint(MINT_AMOUNT),

    onSuccess: async () => {
      dispatch(fetchBalance());
      setState({ balance: { ...balance, loading: false } });
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};
