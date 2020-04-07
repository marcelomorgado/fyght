import { Client, LocalAddress, CryptoUtils, LoomProvider } from "loom-js";
import BN from "bn.js";
import Web3 from "web3";
import Layer2Dai from "./contracts/Layer2Dai.json";
const gatewayAddress = "0xb4CFE11a0c9e781049040DDF9359d4f3447415Db";

export default class Contract {
  private client: any;
  private privateKey: any;
  private publicKey: any;
  private currentUserAddress: any;
  private web3: any;
  private currentNetwork: any;
  private layer2Dai: any;

  async loadContract() {
    this._createClient();
    this._createCurrentUserAddress();
    this._createWebInstance();
    await this._createContractInstance();
  }

  _createClient() {
    this.privateKey = CryptoUtils.generatePrivateKey();
    this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey);
    let writeUrl = "ws://127.0.0.1:46658/websocket";
    let readUrl = "ws://127.0.0.1:46658/queryws";
    let networkId = "default";
    if (process.env.NETWORK == "extdev") {
      writeUrl = "ws://extdev-plasma-us1.dappchains.com:80/websocket";
      readUrl = "ws://extdev-plasma-us1.dappchains.com:80/queryws";
      networkId = "extdev-plasma-us1";
    }

    this.client = new Client(networkId, writeUrl, readUrl);

    this.client.on("error", (msg: string) => {
      console.error("Error on connect to client", msg);
      console.warn("Please verify if loom command is running");
    });
  }

  _createCurrentUserAddress() {
    this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString();
  }

  _createWebInstance() {
    // @ts-ignore
    this.web3 = new Web3(new LoomProvider(this.client, this.privateKey));
  }

  async _createContractInstance() {
    // const networkId = await this._getCurrentNetwork();
    // console.log(`networkId = ${networkId}`);
    // this.currentNetwork = Layer2Dai.networks[networkId];
    // if (!this.currentNetwork) {
    //   throw Error("Contract not deployed on DAppChain");
    // }

    const ABI = Layer2Dai.abi;
    const ADDRESSS = "0x139d0193646660B948FDE475AacEe05914Fd54d4"; //this.currentNetwork.address
    this.layer2Dai = new this.web3.eth.Contract(ABI, ADDRESSS, {
      from: this.currentUserAddress,
    });
  }

  _getCurrentNetwork() {
    if (process.env.NETWORK == "extdev") {
      return "9545242630824";
    } else {
      const web3 = new Web3();
      const chainIdHash = web3.utils
        .soliditySha3(this.client.chainId)
        .slice(2) // Removes 0x
        .slice(0, 13); // Produces safe Number less than 9007199254740991
      const chainId = new BN(chainIdHash).toString();
      return chainId;
    }
  }

  async getBalance(addr: string) {
    return await this.layer2Dai.methods.balanceOf(addr).call({
      from: this.currentUserAddress,
    });
  }
}
