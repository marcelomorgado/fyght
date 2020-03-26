declare module "*.png";
declare module "*.gif";

interface Fyghter {
  id: import("ethers").BigNumber;
  skin: string;
  name: string;
  xp: import("ethers").BigNumber;
  balance: import("ethers").BigNumber;
}

interface Enemy {
  fyghter: Fyghter;
  winProbability: import("ethers").BigNumber;
}

interface Messages {
  errorMessage: string;
  infoMessage: string;
}

interface MetamaskState {
  networkId: number;
  account: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  provider: Provider;
  contracts: { fyghters: Contract; dai: Contract };
  loading: boolean;
}

interface BalanceState {
  amount: import("ethers").BigNumber;
  loading: boolean;
}

interface FyghtState {
  myFyghter: Fyghter;
  enemies: Array<Enemy>;
  messages: Messages;
  metamask: MetamaskState;
  balance: BalanceState;
}

interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface FyghterCreated {
  owner: string;
  id: BigNumber;
  name: string;
}
