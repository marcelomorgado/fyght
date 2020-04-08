const {
  Client,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Contracts,
  soliditySha3,
} = require("loom-js");
const Web3 = require("web3");
const dotenv = require("dotenv");
const { OfflineWeb3Signer } = require("loom-js/dist/solidity-helpers");

dotenv.config();

const {
  LOOM_NETWORK,
  ETHEREUM_NETWORK_ID,
  LOOM_NETWORK_ID,
  LOOM_WRITE_URL,
  LOOM_READ_URL,
  ETHEREUM_PRIVATE_KEY,
  LOOM_PRIVATE_KEY,
  INFURA_PROVIDER_URL,
} = process.env;

const { TransferGateway } = Contracts;

const EthereumDai = require("../build/contracts/EthereumDai.json");
const LoomDai = require("../build/contracts/LoomDai.json");

const {
  networks: {
    [ETHEREUM_NETWORK_ID]: { address: ethereumDaiAddress, transactionHash: ethereumDaiDeployTxHash },
  },
} = EthereumDai;

const {
  networks: {
    [LOOM_NETWORK_ID]: { address: loomDaiAddress },
  },
} = LoomDai;

function loadExtdevAccount() {
  //   const privateKeyStr = fs.readFileSync(path.join(__dirname, "./extdev_private_key"), "utf-8");
  const privateKeyStr = LOOM_PRIVATE_KEY;
  const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr);
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  const client = new Client(LOOM_NETWORK, LOOM_WRITE_URL, LOOM_READ_URL);
  client.txMiddleware = [new NonceTxMiddleware(publicKey, client), new SignedTxMiddleware(privateKey)];
  //   client.on("error", (msg) => {
  //     console.error("PlasmaChain connection error", msg);
  //   });

  return {
    account: LocalAddress.fromPublicKey(publicKey).toString(),
    web3js: new Web3(new LoomProvider(client, privateKey)),
    client,
  };
}

async function mapContracts({
  client,
  signer,
  tokenRinkebyAddress,
  tokenExtdevAddress,
  ownerExtdevAddress,
  rinkebyTxHash,
}) {
  const ownerExtdevAddr = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`);
  const gatewayContract = await TransferGateway.createAsync(client, ownerExtdevAddr);
  const foreignContract = Address.fromString(`eth:${tokenRinkebyAddress}`);
  const localContract = Address.fromString(`${client.chainId}:${tokenExtdevAddress}`);

  const hash = soliditySha3(
    { type: "address", value: tokenRinkebyAddress.slice(2) },
    { type: "address", value: tokenExtdevAddress.slice(2) },
  );

  const foreignContractCreatorSig = await signer.signAsync(hash);
  const foreignContractCreatorTxHash = Buffer.from(rinkebyTxHash.slice(2), "hex");

  await gatewayContract.addContractMappingAsync({
    localContract,
    foreignContract,
    foreignContractCreatorSig,
    foreignContractCreatorTxHash,
  });
}

function loadRinkebyAccount() {
  // const privateKey = fs.readFileSync(path.join(__dirname, "./rinkeby_private_key"), "utf-8");
  const privateKey = ETHEREUM_PRIVATE_KEY;
  const web3js = new Web3(INFURA_PROVIDER_URL);
  const ownerAccount = web3js.eth.accounts.privateKeyToAccount(privateKey);
  web3js.eth.accounts.wallet.add(ownerAccount);
  return { account: ownerAccount, web3js };
}

const main = async () => {
  console.log("Mapping contracts...");
  const { web3js, account } = loadRinkebyAccount();
  const signer = new OfflineWeb3Signer(web3js, account);

  const { client, account: ownerExtdevAddress } = loadExtdevAccount();

  await mapContracts({
    client,
    signer,
    tokenRinkebyAddress: ethereumDaiAddress,
    tokenExtdevAddress: loomDaiAddress,
    ownerExtdevAddress,
    rinkebyTxHash: ethereumDaiDeployTxHash,
  });

  client.disconnect();
  console.log("Mapping contracts... done!");
};

main().catch(console.log);
