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
  errorMessage: string;
  metamask: MetamaskContext;
}

interface MetamaskContext {
  networkId: number;
  account: string;
  ethereum: any;
  provider: Provider;
  // TODO: having contracts as objects and having name (?) as key
  contract: Contract;
  loading: boolean;
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
