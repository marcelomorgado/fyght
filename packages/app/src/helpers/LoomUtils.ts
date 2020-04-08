/* eslint-disable no-undef */
import {
  Client,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Address,
  createDefaultTxMiddleware,
  getMetamaskSigner,
  NonceTxMiddleware,
  SignedEthTxMiddleware,
  EthersSigner,
} from "loom-js";

import { AddressMapper } from "loom-js/dist/contracts";

const LOOM_CHAIN_ID = process.env.LOOM_CHAIN_ID;
const LOOM_WRITE_URL = process.env.LOOM_WRITE_URL;
const LOOM_READ_URL = process.env.LOOM_READ_URL;

export const loadMapping = async (ethereumAccount: any, client: any): Promise<AddressMapper> => {
  const mapper: AddressMapper = await AddressMapper.createAsync(client, ethereumAccount);
  let accountMapping: any = { ethereum: null, loom: null };

  try {
    const mapping = await mapper.getMappingAsync(ethereumAccount);
    accountMapping = {
      ethereum: mapping.from,
      loom: mapping.to,
    };
  } catch (error) {
    console.error(error);
    accountMapping = null;
  } finally {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    mapper.removeAllListeners();
  }
  return accountMapping;
};

export const setupSigner = async (loomClient: any, provider: any): Promise<Address> => {
  const signer = getMetamaskSigner(provider);
  //   const signer = provider.getSigner();
  const ethAddress = await signer.getAddress();
  const callerAddress = new Address("eth", LocalAddress.fromHexString(ethAddress));

  loomClient.txMiddleware = [new NonceTxMiddleware(callerAddress, loomClient), new SignedEthTxMiddleware(signer)];

  return callerAddress;
};

export const createClient = (): Client => new Client(LOOM_CHAIN_ID, LOOM_WRITE_URL, LOOM_READ_URL);

export const createNewMapping = async (signer: any) => {
  const ethereumAccount = await signer.getAddress();
  const ethereumAddress = Address.fromString(`eth:${ethereumAccount}`);
  const loomEthSigner = new EthersSigner(signer);
  const privateKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  const client = createClient();
  client.txMiddleware = createDefaultTxMiddleware(client, privateKey);
  const loomAddress = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey));
  const mapper = await AddressMapper.createAsync(client, loomAddress);
  try {
    await mapper.addIdentityMappingAsync(ethereumAddress, loomAddress, loomEthSigner);
    client.disconnect();
  } catch (e) {
    if (!e.message.includes("identity mapping already exists")) {
      console.error(e);
    }
    client.disconnect();
    return false;
  }
};

export const createLoomProvider = async (client: any, callerAddress: any): Promise<LoomProvider> => {
  const dummyKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(dummyKey);
  const dummyAccount = LocalAddress.fromPublicKey(publicKey).toString();
  const loomProvider = new LoomProvider(client, dummyKey, () => client.txMiddleware);
  loomProvider.setMiddlewaresForAddress(callerAddress.local.toString(), client.txMiddleware);
  loomProvider.callerChainId = callerAddress.chainId;
  // remove dummy account
  loomProvider.accounts.delete(dummyAccount);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //@ts-ignore
  loomProvider._accountMiddlewares.delete(dummyAccount);
  return loomProvider;
};

export default { loadMapping, setupSigner, createClient, createNewMapping, createLoomProvider, getMetamaskSigner };
