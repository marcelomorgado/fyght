/* eslint-disable no-undef */
//
// Note: These functions where based on this file here: https://github.com/loomnetwork/truffle-dappchain-example/blob/master/gateway-cli.js
// Todo: Clean the code of this class. There are a lot of duplicated code.
// Refs: https://github.com/marcelomorgado/fyght/issues/213
//
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
import { ethers } from "ethers";
import { AddressMapper } from "loom-js/dist/contracts";
import { OfflineWeb3Signer } from "loom-js/dist/solidity-helpers";
import Web3 from "web3";

const LOOM_NETWORK = process.env.LOOM_NETWORK;
const LOOM_WRITE_URL = process.env.LOOM_WRITE_URL;
const LOOM_READ_URL = process.env.LOOM_READ_URL;

const loadMapping = async (ethereumAccount: any, client: any): Promise<AddressMapper> => {
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

const setupSigner = async (loomClient: any, provider: any): Promise<Address> => {
  const signer = getMetamaskSigner(provider);
  const ethAddress = await signer.getAddress();
  const callerAddress = new Address("eth", LocalAddress.fromHexString(ethAddress));

  loomClient.txMiddleware = [new NonceTxMiddleware(callerAddress, loomClient), new SignedEthTxMiddleware(signer)];

  return callerAddress;
};

const createClient = (): Client => {
  const client = new Client(LOOM_NETWORK, LOOM_WRITE_URL, LOOM_READ_URL);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  client.on("error", (msg) => {
    // eslint-disable-next-line no-console
    console.error("Loom client error", msg);
  });
  return client;
};

const createNewMapping = async (signer: any) => {
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

const createLoomProvider = async (client: any, callerAddress: any): Promise<LoomProvider> => {
  const dummyKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(dummyKey);
  const dummyAccount = LocalAddress.fromPublicKey(publicKey).toString();
  const loomProvider = new LoomProvider(client, dummyKey, () => client.txMiddleware);
  loomProvider.setMiddlewaresForAddress(callerAddress.local.toString(), client.txMiddleware);
  loomProvider.callerChainId = callerAddress.chainId;
  // remove dummy account
  loomProvider.accounts.delete(dummyAccount);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  loomProvider._accountMiddlewares.delete(dummyAccount);

  return loomProvider;
};

const setupLoomUsingMetamask = async (metamaskProvider: any): Promise<{ loomProvider: any; loomAccount: any }> => {
  const loomClient = createClient();
  const callerAddress = await setupSigner(loomClient, metamaskProvider);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const web3loom = new Web3(await createLoomProvider(loomClient, callerAddress));
  const loomProvider = new ethers.providers.Web3Provider(web3loom.currentProvider);

  let accountMapping = await loadMapping(callerAddress, loomClient);
  if (accountMapping === null) {
    const signer = getMetamaskSigner(metamaskProvider);
    await createNewMapping(signer);
    accountMapping = await loadMapping(callerAddress, loomClient);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const loomAccount = accountMapping.loom.local.toString();

  return { loomProvider, loomAccount };
};

const loadRinkebyAccount = () => {
  const privateKey = ethers.Wallet.createRandom().privateKey;
  const web3js = new Web3(`https://rinkeby.infura.io/v3/ee6771b211d24dc3a4a44dcd0813ff9f`);
  const ownerAccount = web3js.eth.accounts.privateKeyToAccount(privateKey);
  web3js.eth.accounts.wallet.add(ownerAccount);
  return { account: ownerAccount, web3js };
};

const loadExtdevAccount = () => {
  const privateKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  const client = createClient();

  client.txMiddleware = createDefaultTxMiddleware(client, privateKey);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const web3js = new Web3(new LoomProvider(client, privateKey));

  return {
    account: LocalAddress.fromPublicKey(publicKey).toString(),
    web3js,
    client,
  };
};

const mapAccounts = async ({ client, signer, ethereumAddress, loomAddress }) => {
  const ownerRinkebyAddr = Address.fromString(`eth:${ethereumAddress}`);
  const ownerExtdevAddr = Address.fromString(`${client.chainId}:${loomAddress}`);
  const mapperContract = await AddressMapper.createAsync(client, ownerExtdevAddr);

  try {
    const mapping = await mapperContract.getMappingAsync(ownerRinkebyAddr);
    console.log(`${mapping.from.toString()} is already mapped to ${mapping.to.toString()}`);
    return;
  } catch (err) {
    // assume this means there is no mapping yet, need to fix loom-js not to throw in this case
  }
  console.log(`mapping ${ownerRinkebyAddr.toString()} to ${ownerExtdevAddr.toString()}`);
  await mapperContract.addIdentityMappingAsync(ownerRinkebyAddr, ownerExtdevAddr, signer);
  console.log(`Mapped ${ownerExtdevAddr} to ${ownerRinkebyAddr}`);
};

const setupLoomUsingEphemeralAccount = async (): Promise<{ loomProvider: any; loomAccount: any }> => {
  const rinkeby = loadRinkebyAccount();
  const extdev = loadExtdevAccount();

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const signer = new OfflineWeb3Signer(rinkeby.web3js, rinkeby.account);
  await mapAccounts({
    client: extdev.client,
    signer,
    ethereumAddress: rinkeby.account.address,
    loomAddress: extdev.account,
  });

  const loomProvider = new ethers.providers.Web3Provider(extdev.web3js.currentProvider);
  return { loomProvider, loomAccount: extdev.account };
};

export const setupLoom = async (metamaskProvider: any): Promise<{ loomProvider: any; loomAccount: any }> => {
  if (metamaskProvider) {
    return setupLoomUsingMetamask(metamaskProvider);
  }
  return setupLoomUsingEphemeralAccount();
};

export default {
  setupLoom,
};
