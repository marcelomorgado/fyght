import { ethers, Signer } from "ethers";
import {
  Client,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Address,
  Contracts,
  createDefaultTxMiddleware,
  getMetamaskSigner,
  NonceTxMiddleware,
  SignedEthTxMiddleware,
  EthersSigner,
} from "loom-js";
import Web3 from "web3";
import Contract from "./Contract";
const { AddressMapper } = Contracts;
const LAYER1_NETWORK_ID = 1337;
const LAYER1_NETWORK = "ganache";

const LAYER2_NETWORK_ID = 13654820909954;
const LAYER2_NETWORK = "local_loom";

const LOOM_WRITE_URL = "ws://127.0.0.1:46658/websocket";
const LOOM_READ_URL = "ws://127.0.0.1:46658/queryws";
const LOOM_NETWORK_ID = "default";

const LAYER1_DAI_CONTRACT_ADDRESS = "0x49de9b5f6c0Dc3e22e9Af986477Cac01dBe82659";
const FYGHTERS_CONTRACT_ADDRESS = "0x1842C769b1f8bED752dab26b6e8A296b37f4aa83";
const LAYER2_DAI_CONTRACT_ADDRESS = "0x7417955B1e801268FfE73605Bf62043B1Ba757BC";
const LAYER1_DAI_CONTRACT_ABI = require("./contracts/Layer1Dai.json").abi;
const LAYER2_DAI_CONTRACT_ABI = require("./contracts/Layer2Dai.json").abi;
const FYGHTERS_CONTRACT_ABI = require("./contracts/Fyghters.json").abi;

const gatewayL1Address = "0xb4CFE11a0c9e781049040DDF9359d4f3447415Db";
const gatewayL1PrivKey = "0xd89eb49bf92fe239b60367120e81090ba9736db2657b7e05a4821219ebe65343";

const gatewayL2Address = "0x63999199BA2964a929e48090Bf4Ebf13f7315f3f";
const gatewayL2PrivateKey =
  "80B2A6196830CDFD3810F6201023C0857DF47E4EB80548E22A666C2023819146F2D079D2D7E1191F0AA7B7EC6F5B718D6175F8D368170E63BA4A0CE5902F82FB";

const _loadMapping = async (ethereumAccount: any, client: any) => {
  const mapper = await AddressMapper.createAsync(client, ethereumAccount);
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
    mapper.removeAllListeners();
  }
  return accountMapping;
};

const _setupSigner = async (loomClient: any, provider: any) => {
  //  const signer = getMetamaskSigner(provider);
  const signer = provider.getSigner();
  const ethAddress = await signer.getAddress();
  const callerAddress = new Address("eth", LocalAddress.fromHexString(ethAddress));

  loomClient.txMiddleware = [new NonceTxMiddleware(callerAddress, loomClient), new SignedEthTxMiddleware(signer)];

  return callerAddress;
};

const _createClient = () => new Client(LOOM_NETWORK_ID, LOOM_WRITE_URL, LOOM_READ_URL);

const _createNewMapping = async (signer: any) => {
  const ethereumAccount = await signer.getAddress();
  const ethereumAddress = Address.fromString(`eth:${ethereumAccount}`);
  const loomEthSigner = new EthersSigner(signer);
  const privateKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  const client = _createClient();
  client.txMiddleware = createDefaultTxMiddleware(client, privateKey);
  const loomAddress = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey));

  const mapper = await AddressMapper.createAsync(client, loomAddress);
  try {
    await mapper.addIdentityMappingAsync(ethereumAddress, loomAddress, loomEthSigner);
    client.disconnect();
  } catch (e) {
    if (e.message.includes("identity mapping already exists")) {
    } else {
      console.error(e);
    }
    client.disconnect();
    return false;
  }
};

const _createLoomProvider = async (client: any, callerAddress: any) => {
  const dummyKey = CryptoUtils.generatePrivateKey();
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(dummyKey);
  const dummyAccount = LocalAddress.fromPublicKey(publicKey).toString();
  const loomProvider = new LoomProvider(client, dummyKey, () => client.txMiddleware);
  loomProvider.setMiddlewaresForAddress(callerAddress.local.toString(), client.txMiddleware);
  loomProvider.callerChainId = callerAddress.chainId;
  // remove dummy account
  loomProvider.accounts.delete(dummyAccount);
  //@ts-ignore
  loomProvider._accountMiddlewares.delete(dummyAccount);
  return loomProvider;
};

const main = async () => {
  const ethProvider = new ethers.providers.JsonRpcProvider();

  const client: any = new Client(LOOM_NETWORK_ID, LOOM_WRITE_URL, LOOM_READ_URL);
  const callerAddress = await _setupSigner(client, ethProvider);
  console.log(callerAddress.local.toString());
  const loomProvider = await _createLoomProvider(client, callerAddress);

  let accountMapping = await _loadMapping(callerAddress, client);
  if (accountMapping === null) {
    console.log("Create a new mapping");
    // const signer = getMetamaskSigner(ethProvider);
    const signer = ethProvider.getSigner();
    await _createNewMapping(signer);
    accountMapping = await _loadMapping(callerAddress, client);
    console.log(accountMapping);
  } else {
    console.log("mapping already exists");
  }

  // @ts-ignore
  const web3 = new Web3(loomProvider);
  const layer2Provider = new ethers.providers.Web3Provider(web3.currentProvider);

  // //   //   const ethereumAddress = await ethereumSigner.getAddress();
  // //   //   const callerAddress = new Address("eth", LocalAddress.fromHexString(ethereumAddress));
  // //   //   client.txMiddleware = [new NonceTxMiddleware(callerAddress, client), new SignedEthTxMiddleware(ethereumSigner)];
  // console.log(await layer2Provider.getSigner().getAddress());

  const fyghters = new ethers.Contract(FYGHTERS_CONTRACT_ADDRESS, FYGHTERS_CONTRACT_ABI, layer2Provider.getSigner());
  // const tx = await fyghters.create("Marcelo", { gasLimit: 0 });
  // console.log(tx);
  const layer2Dai = new ethers.Contract(
    LAYER2_DAI_CONTRACT_ADDRESS,
    LAYER2_DAI_CONTRACT_ABI,
    layer2Provider.getSigner()
  );

  console.log(await layer2Dai.gateway());
  await layer2Dai.mintToGateway("10", { gasLimit: 0 });
  // console.log(tx);
  const balance = await layer2Dai.balanceOf(gatewayL1Address);
  console.log(balance.toString());
};

main().catch(console.log);

// (async () => {
//   const c = new Contract();
//   c.loadContract();
//   const b = await c.getBalance(gatewayAddress);
//   console.log(b);
// })();
