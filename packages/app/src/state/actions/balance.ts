import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT } from "../../constants";
import { setErrorMessage } from "./messages";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchBalance = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      account,
      contracts: { layer2Dai },
    },
  } = getState();

  const amount = await layer2Dai.balanceOf(account);
  setState({ balance: { amount, loading: false } });
};

export const mintDai = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { layer2Dai },
    },
    balance,
  } = getState();

  setState({ balance: { ...balance, loading: true } });

  optimisticUpdate({
    doTransaction: async () => layer2Dai.mint(MINT_AMOUNT),

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
