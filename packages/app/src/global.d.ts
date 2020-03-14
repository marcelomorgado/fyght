declare module "*.png";
declare module "*.gif";

// TODO: Rename type
interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
  metamask: Metamask;
}

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

// TODO: Rename from metamask to root (maybe another context?)
interface Metamask {
  networkId: number;
  account: string;
  // TODO: Deprecated?
  ethereum: any;
  provider: Provider;
  // TODO: having contracts as objects and having name (?) as key
  contract: Fyghters;

  //const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
}
