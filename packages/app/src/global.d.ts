declare module "*.png";
declare module "*.gif";

// TODO: Review this boilerplate
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "dev";
    FYGHTERS_CONTRACT_ADDRESS: string;
    DAI_CONTRACT_ADDRESS: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  provider: Provider;
  contracts: { fyghters: Contract; dai: Contract };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}
