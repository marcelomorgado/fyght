declare module "*.png";
declare module "*.gif";

interface Fyghter {
  id: import("ethers/utils").BigNumber;
  skin: string;
  name: string;
  xp: import("ethers/utils").BigNumber;
}

interface Action {
  type: string;
  payload?: any;
}

interface Metamask {
  networkId: number;
  account: string;
  // TODO: Set the correct type
  ethereum: any;
}
