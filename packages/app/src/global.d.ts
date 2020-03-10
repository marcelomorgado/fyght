declare module "*.png";
declare module "*.gif";

interface Fyghter {
  id: import("ethers/utils").BigNumber;
  skin: string;
  name: string;
  xp: import("ethers/utils").BigNumber;
}
