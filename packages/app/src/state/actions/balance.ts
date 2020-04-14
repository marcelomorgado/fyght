import { StoreActionApi } from "react-sweet-state";
import { optimisticUpdate } from "../utils";
import { MINT_AMOUNT } from "../../constants";
import { setErrorMessage } from "./messages";
import { BigNumber } from "ethers/utils";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchBalance = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      loomAccount,
      contracts: { loomDai },
    },
    daiBalances: { loomBalance },
  } = getState();

  const amount = loomAccount ? await loomDai.balanceOf(loomAccount) : new BigNumber(0);
  setState({ daiBalances: { ethereumBalance: { amount, loading: false }, loomBalance } });
};

export const mintDai = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { loomDai, ethereumDai },
    },
    daiBalances: { ethereumBalance, loomBalance },
  } = getState();

  setState({ daiBalances: { ethereumBalance: { ...ethereumBalance, loading: true }, loomBalance } });

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
      setState({ daiBalances: { ethereumBalance: { ...ethereumBalance, loading: false }, loomBalance } });
    },
    onError: (errorMessage: string) => {
      dispatch(setErrorMessage(errorMessage));
    },
    getState,
  });
};
