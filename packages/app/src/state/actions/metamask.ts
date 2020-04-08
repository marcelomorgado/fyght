/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { StoreActionApi } from "react-sweet-state";
import { ethers } from "ethers";
import { fetchBalance } from "./balance";
import LoomUtils from "../../helpers/LoomUtils";
import Web3 from "web3";

//
// Note: Parcel doesn't support process.env es6 destructuring
//
// Refs:
// https://github.com/parcel-bundler/parcel/issues/2299#issuecomment-439768971
// https://en.parceljs.org/env.html
//
const NETWORK = process.env.NETWORK;
const LOOM_NETWORK_ID = process.env.LOOM_NETWORK_ID;

const Fyghters = require("../../contracts/Fyghters.json");
const Dai = require("../../contracts/Dai.json");

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

  let ethereumProvider: any = ethers.getDefaultProvider(NETWORK);

  let account = null;
  let signerOrProvider = ethereumProvider;
  let loomProvider;
  let loomAccount;

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

    ({ selectedAddress: account } = ethereum);

    if (account) {
      const client: any = LoomUtils.createClient();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      client.on("error", console.error);
      const callerAddress = await LoomUtils.setupSigner(client, ethereum);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const web3loom = new Web3(await LoomUtils.createLoomProvider(client, callerAddress));
      loomProvider = new ethers.providers.Web3Provider(web3loom.currentProvider);

      let accountMapping = await LoomUtils.loadMapping(callerAddress, client);
      if (accountMapping === null) {
        const signer = LoomUtils.getMetamaskSigner(ethereum);
        await LoomUtils.createNewMapping(signer);
        accountMapping = await LoomUtils.loadMapping(callerAddress, client);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      loomAccount = accountMapping.loom.local.toString();

      signerOrProvider = loomProvider.getSigner();
    }
  }

  const network = await ethereumProvider.getNetwork();
  const { chainId: networkId } = network;

  const {
    abi: fyghtersABI,
    networks: {
      [LOOM_NETWORK_ID]: { address: fyghtersAddress },
    },
  } = Fyghters;

  const {
    abi: daiABI,
    networks: {
      [LOOM_NETWORK_ID]: { address: daiAddress },
    },
  } = Dai;

  const fyghters = new ethers.Contract(fyghtersAddress, fyghtersABI, signerOrProvider);
  const dai = new ethers.Contract(daiAddress, daiABI, signerOrProvider);

  dispatch(setMetamaskAccount(account));

  setState({
    metamask: {
      ...metamask,
      contracts: { fyghters, dai },
      account,
      ethereum,
      loomAccount,
      provider: loomProvider,
      networkId,
      loading: false,
    },
  });
  dispatch(fetchBalance());
};
