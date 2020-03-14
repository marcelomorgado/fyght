declare module "*.png";
declare module "*.gif";

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "dev";
    FYGHTERS_CONTRACT_ADDRESS: string;
  }
}

interface FyghtContext {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
  metamask: Metamask;
}

interface Fyghter {
  id: import("ethers").BigNumber;
  skin: string;
  name: string;
  xp: import("ethers").BigNumber;
}

interface Action {
  type: string;
  payload?: any;
}

// TODO: Rename from metamask to root (maybe another context?)
interface Metamask {
  networkId: number;
  account: string;
  // TODO: Deprecated?
  ethereum: any;
  provider: Provider;
  // TODO: having contracts as objects and having name (?) as key
  contract: Contract;
}
