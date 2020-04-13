/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { StoreActionApi } from "react-sweet-state";
import { ethers } from "ethers";
import { fetchBalance } from "./balance";
import LoomUtils from "../../helpers/LoomUtils";
import Web3 from "web3";
import Fyghters from "../../contracts/Fyghters.json";
import LoomDai from "../../contracts/LoomDai.json";
import EthereumDai from "../../contracts/EthereumDai.json";

//
// Note: Parcel doesn't support process.env es6 destructuring
//
// Refs:
// https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971
// https://en.parceljs.org/env.html
//
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const LOOM_NETWORK_ID = process.env.LOOM_NETWORK_ID;

const ETHEREUM_NETWORK_ID = process.env.ETHEREUM_NETWORK_ID;

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
  setState({ metamask: { ...metamask, ethereumAccount: account } });
};

export const initializeMetamask = () => async ({ setState, getState, dispatch }: StoreApi): Promise<void> => {
  const { metamask } = getState();

  const { ethereum } = window;
  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
  }

  let ethereumProvider: any = ethers.getDefaultProvider(ETHEREUM_NETWORK);
  let ethereumAccount = null;
  let ethereumSignerOrProvider = ethereumProvider;

  let { loomProvider } = await LoomUtils.setupLoom(null);
  let loomAccount = null;
  let loomSignerOrProvider: any = loomProvider.getSigner();

  // Metamask installed
  if (ethereum) {
    ethereumProvider = new ethers.providers.Web3Provider(ethereum);

    // Note: The metamask docs recommends to use the 'chainChanged' event instead but it isn't working
    // See more: https://docs.metamask.io/guide/ethereum-provider.html#methods-new-api
    ethereum.on("networkChanged", (networkId: number) => {
      dispatch(setMetamaskNetworkId(networkId));
      dispatch(fetchBalance());
    });

    ethereum.on("accountsChanged", ([account]: string[]) => {
      dispatch(setMetamaskAccount(account));
      dispatch(fetchBalance());
    });

    ({ selectedAddress: ethereumAccount } = ethereum);

    if (ethereumAccount) {
      ({ loomProvider, loomAccount } = await LoomUtils.setupLoom(ethereum));

      loomSignerOrProvider = loomProvider.getSigner();
      ethereumSignerOrProvider = ethereumProvider.getSigner();
    }
  }

  const network = await ethereumProvider.getNetwork();
  const { chainId: networkId } = network;

  const {
    abi: ethereumDaiABI,
    networks: {
      [ETHEREUM_NETWORK_ID]: { address: ethereumDaiAddress },
    },
  } = EthereumDai as ContractJson;

  const ethereumDai = new ethers.Contract(ethereumDaiAddress, ethereumDaiABI, ethereumSignerOrProvider);

  const {
    abi: fyghtersABI,
    networks: {
      [LOOM_NETWORK_ID]: { address: fyghtersAddress },
    },
  } = Fyghters as ContractJson;

  const {
    abi: loomDaiABI,
    networks: {
      [LOOM_NETWORK_ID]: { address: loomDaiAddress },
    },
  } = LoomDai as ContractJson;

  const fyghters = new ethers.Contract(fyghtersAddress, fyghtersABI, loomSignerOrProvider);
  const loomDai = new ethers.Contract(loomDaiAddress, loomDaiABI, loomSignerOrProvider);

  dispatch(setMetamaskAccount(ethereumAccount));

  setState({
    metamask: {
      ...metamask,
      contracts: { fyghters, loomDai, ethereumDai },
      ethereumAccount,
      ethereum,
      loomAccount,
      loomProvider,
      ethereumProvider,
      networkId,
      loading: false,
    },
  });
  dispatch(fetchBalance());
};
