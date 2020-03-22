import { StoreActionApi } from "react-sweet-state";
import { ethers } from "ethers";

//
// Note: Parcel doesn't support process.env es6 destructuring
//
// Refs:
// https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971
// https://en.parceljs.org/env.html
//
// eslint-disable-next-line no-undef
const FYGHTERS_CONTRACT_ADDRESS = process.env.FYGHTERS_CONTRACT_ADDRESS;
// eslint-disable-next-line no-undef
const DAI_CONTRACT_ADDRESS = process.env.DAI_CONTRACT_ADDRESS;
const FYGHTERS_CONTRACT_ABI = require("../../contracts/Fyghters.json").abi;
const DAI_CONTRACT_ABI = require("../../contracts/Dai.json").abi;

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

// TODO: Move this declaration to the global.d.ts file
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

const setMetamaskNetworkId = (networkId: number) => ({ setState, getState }: StoreApi): void => {
  const { metamask } = getState();
  setState({ metamask: { ...metamask, networkId } });
};

export const setMetamaskAccount = (account: string) => ({ setState, getState }: StoreApi): void => {
  const { metamask } = getState();
  setState({ metamask: { ...metamask, account } });
};

export const initializeMetamask = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const { metamask } = getState();

  const { ethereum } = window;
  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
  }

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
