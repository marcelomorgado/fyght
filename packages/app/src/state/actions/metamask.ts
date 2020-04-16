/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { StoreActionApi } from "react-sweet-state";
import { ethers } from "ethers";
import { fetchBalances } from "./daiBalances";
import LoomUtils from "../../helpers/LoomUtils";
import Fyghters from "../../contracts/Fyghters.json";
import LoomDai from "../../contracts/LoomDai.json";
import EthereumDai from "../../contracts/EthereumDai.json";
import EthereumGateway from "../../helpers/Gateway.json";
import { BigNumber } from "ethers/utils";

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

  let { loomProvider, loomAccount, loomClient } = await LoomUtils.setupLoom(null);
  let loomSignerOrProvider: any = loomProvider.getSigner();

  // Metamask installed
  if (ethereum) {
    ethereumProvider = new ethers.providers.Web3Provider(ethereum);

    // Note: The metamask docs recommends to use the 'chainChanged' event instead but it isn't working
    // See more: https://docs.metamask.io/guide/ethereum-provider.html#methods-new-api
    ethereum.on("networkChanged", (networkId: number) => {
      dispatch(setMetamaskNetworkId(networkId));
      dispatch(fetchBalances());
    });

    ethereum.on("accountsChanged", ([account]: string[]) => {
      dispatch(setMetamaskAccount(account));
      dispatch(fetchBalances());
    });

    ({ selectedAddress: ethereumAccount } = ethereum);

    if (ethereumAccount) {
      ({ loomProvider, loomAccount, loomClient } = await LoomUtils.setupLoom(ethereum));

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

  const { abi: transferGatewayABI } = EthereumGateway as ContractJson;

  // TODO: From .env
  const ethereumGatewayAddress = "0x9c67fD4eAF0497f9820A3FBf782f81D6b6dC4Baa";
  const ethereumGateway = new ethers.Contract(ethereumGatewayAddress, transferGatewayABI, ethereumSignerOrProvider);
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

  // TODO: From .env
  const loomGatewayAddress = "0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D";
  const loomGateway = new ethers.Contract(loomGatewayAddress, transferGatewayABI, loomSignerOrProvider);
  const fyghters = new ethers.Contract(fyghtersAddress, fyghtersABI, loomSignerOrProvider);
  const loomDai = new ethers.Contract(loomDaiAddress, loomDaiABI, loomSignerOrProvider);

  dispatch(setMetamaskAccount(ethereumAccount));

  setState({
    metamask: {
      ...metamask,
      contracts: { fyghters, loomDai, ethereumDai, ethereumGateway, loomGateway },
      ethereumAccount,
      ethereum,
      loomAccount,
      loomProvider,
      loomClient,
      ethereumProvider,
      networkId,
      loading: false,
    },
  });
  dispatch(fetchBalances());
};
