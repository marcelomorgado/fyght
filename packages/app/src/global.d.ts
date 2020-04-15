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
  loomAccount: string;
  ethereumAccount: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  loomProvider: Provider;
  ethereumProvider: Provider;
  contracts: { fyghters: Contract; loomDai: Contract; ethereumDai: Contract; ethereumGateway: Contract };
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
  daiBalances: { ethereumBalance: BalanceState; loomBalance: BalanceState };
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

interface ContractJson {
  abi: any;
  networks: { [key: string]: any };
}
