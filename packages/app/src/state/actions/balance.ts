import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT } from "../../constants";
import { setErrorMessage } from "./messages";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchBalance = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      loomAccount: account,
      contracts: { loomDai },
    },
  } = getState();

  const amount = await loomDai.balanceOf(account);
  setState({ balance: { amount, loading: false } });
};

export const mintDai = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { loomDai, ethereumDai },
    },
    balance,
  } = getState();

  setState({ balance: { ...balance, loading: true } });

  optimisticUpdate({
    doTransaction: async () => {
      return loomDai.mint(MINT_AMOUNT, { gasLimit: 0 });

      // WIP
      // return await ethereumDai.mint(MINT_AMOUNT);
      // const rinkebyGatewayAddress = "0x9c67fD4eAF0497f9820A3FBf782f81D6b6dC4Baa";
      // return await ethereumDai.transfer(rinkebyGatewayAddress, MINT_AMOUNT);
    },
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
