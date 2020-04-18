/* eslint-disable no-undef */
//
// Note: These functions where based on this file here: https://github.com/loomnetwork/truffle-dappchain-example/blob/master/gateway-cli.js
// Todo: Clean the code of this class. There are a lot of duplicated code.
// Refs: https://github.com/marcelomorgado/fyght/issues/213
//
import { ethers, Contract } from "ethers";
import Web3 from "web3";
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
  Contracts,
  createEthereumGatewayAsync,
} from "loom-js";
import { OfflineWeb3Signer } from "loom-js/dist/solidity-helpers";
import { IWithdrawalReceipt } from "loom-js/dist/contracts/transfer-gateway";
import { AddressMapper } from "loom-js/dist/contracts";
import BN from "bn.js";
const { TransferGateway } = Contracts;

const LOOM_NETWORK = process.env.LOOM_NETWORK;
const LOOM_WRITE_URL = process.env.LOOM_WRITE_URL;
const LOOM_READ_URL = process.env.LOOM_READ_URL;

// TODO: From .env
const rinkebyGatewayAddress = "0x9c67fD4eAF0497f9820A3FBf782f81D6b6dC4Baa";
const extdevGatewayAddress = "0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D";

// Returns a promise that will be resolved with the signed withdrawal receipt that contains the
// data that must be submitted to the Ethereum Gateway to withdraw ERC20 tokens.
const transferTokensToLoomGateway = async ({
  client,
  amountInWei,
  ownerExtdevAddress,
  ownerRinkebyAddress,
  tokenExtdevAddress,
  tokenRinkebyAddress,
  timeout,
  loomDai,
}: {
  client: any;
  amountInWei: any;
  ownerExtdevAddress: any;
  ownerRinkebyAddress: any;
  tokenExtdevAddress: any;
  tokenRinkebyAddress: any;
  timeout: any;
  loomDai: Contract;
}): Promise<IWithdrawalReceipt> => {
  const ea = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`);
  // TODO: Remove this since it's creating an extra call
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const { ethereum: ownerExtdevAddr } = await loadMapping(ea, client);

  const gatewayContract = await TransferGateway.createAsync(client, ownerExtdevAddr);

  try {
    // TODO: There is a way to set gasLimit=0 globally?
    await loomDai.approve(extdevGatewayAddress, amountInWei, { gasLimit: 0 });
  } catch (err) {
    console.error("Withdraw failed while trying to approve token transfer to DAppChain Gateway.");
    throw err;
  }

  const ownerRinkebyAddr = Address.fromString(`eth:${ownerRinkebyAddress}`);
  const tokenExtdevAddr = Address.fromString(`${client.chainId}:${tokenExtdevAddress}`);

  const receiveSignedWithdrawalEvent = new Promise((resolve, reject) => {
    let timer = setTimeout(() => reject(new Error("Timeout while waiting for withdrawal to be signed")), timeout);

    const listener = (event: any): void => {
      const tokenEthAddr = Address.fromString(`eth:${tokenRinkebyAddress}`);
      if (
        event.tokenContract.toString() === tokenEthAddr.toString() &&
        event.tokenOwner.toString() === ownerRinkebyAddr.toString()
      ) {
        console.log("receiveSignedWithdrawalEvent event called");
        clearTimeout(timer);
        timer = null;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        gatewayContract.removeAllListeners(TransferGateway.EVENT_TOKEN_WITHDRAWAL);
        console.log("Oracle signed tx ", CryptoUtils.bytesToHexAddr(event.sig));
        resolve(event);
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    gatewayContract.on(TransferGateway.EVENT_TOKEN_WITHDRAWAL, listener);
  });

  try {
    console.log(`${amountInWei} ${tokenExtdevAddr} ${ownerRinkebyAddr}`);
    await gatewayContract.withdrawERC20Async(new BN(amountInWei.toString(), 10), tokenExtdevAddr, ownerRinkebyAddr);
    console.log(`${amountInWei.toString()} tokens deposited to DAppChain Gateway...`);
  } catch (err) {
    console.error("Withdraw failed while trying to deposit tokens to DAppChain Gateway.");
    throw err;
  }

  await receiveSignedWithdrawalEvent;
  return gatewayContract.withdrawalReceiptAsync(ownerExtdevAddr);
};

const withdrawCoinFromRinkebyGateway = async ({
  ethersSigner,
  receipt,
  gas,
}: {
  ethersSigner: any;
  receipt: any;
  gas: any;
}): Promise<any> => {
  // TODO: Get from NETWORK_ID
  const version = 2; // 1-mainnet, 2-rinkeby
  const gatewayContract = await createEthereumGatewayAsync(version, rinkebyGatewayAddress, ethersSigner);
  const tx = await gatewayContract.withdrawAsync(receipt, { gasLimit: gas });
  return tx.hash;
};

export const withdrawCoins = async ({
  loomClient,
  loomDai,
  loomAccountAddress,
  ethereumAccountAddress,
  ethereumDai,
  ethereumProvider,
  amount,
}: {
  loomClient: any;
  loomDai: Contract;
  loomAccountAddress: any;
  ethereumAccountAddress: any;
  ethereumDai: Contract;
  ethereumProvider: any;
  amount: any;
}): Promise<void> => {
  try {
    const receipt = await transferTokensToLoomGateway({
      client: loomClient,
      amountInWei: amount,
      ownerExtdevAddress: loomAccountAddress,
      ownerRinkebyAddress: ethereumAccountAddress,
      tokenExtdevAddress: loomDai.address,
      tokenRinkebyAddress: ethereumDai.address,
      timeout: 120 * 1000,
      loomDai,
    });

    const txHash = await withdrawCoinFromRinkebyGateway({
      ethersSigner: ethereumProvider.getSigner(),
      receipt,
      gas: 350000,
    });
    console.log(`${amount} tokens withdrawn from Ethereum Gateway.`);
    console.log(`Rinkeby tx hash: ${txHash}`);
  } catch (err) {
    console.error(err);
  } finally {
    if (loomClient) {
      loomClient.disconnect();
    }
  }
};

const loadMapping = async (ethereumAccount: any, client: any): Promise<any> => {
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

const setupLoomUsingMetamask = async (
  metamaskProvider: any
): Promise<{ loomProvider: any; loomAccount: any; loomClient: any }> => {
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

  return { loomProvider, loomAccount, loomClient };
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

const setupLoomUsingEphemeralAccount = async (): Promise<{ loomProvider: any; loomAccount: any; loomClient: any }> => {
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
  return { loomProvider, loomAccount: extdev.account, loomClient: extdev.client };
};

export const setupLoom = async (
  metamaskProvider: any
): Promise<{ loomProvider: any; loomAccount: any; loomClient: any }> => {
  if (metamaskProvider) {
    return setupLoomUsingMetamask(metamaskProvider);
  }
  return setupLoomUsingEphemeralAccount();
};

export default {
  setupLoom,
  withdrawCoins,
};
