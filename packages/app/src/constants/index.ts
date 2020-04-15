import { BigNumber } from "ethers/utils";

export enum Skin {
  NAKED = "naked",
  NORMAL_GUY = "normal_guy",
  KARATE_KID = "karate_kid",
  JAPONESE = "japonese",
  MONK = "monk",
  NINJA = "ninja",
  NO_ONE = "no_one",
  DEMON = "demon",
  MASTER = "master",
}

export enum AvatarSize {
  SMALL = "small",
  MEDIUM = "medium",
}

export const ONE = new BigNumber(`${1e18}`);

// TODO: Read the betValue from the smart contract
export const BET_VALUE = `${5e18}`;

// TODO: Read the betValue from the smart contract
export const MIN_DEPOSIT = `${5e18}`;

export const MINT_AMOUNT = new BigNumber("50").mul(ONE);

export const DEPOSIT_TO_LOOM_AMOUNT = `${10e18}`;

export const APPROVAL_AMOUNT = new BigNumber("100").pow(new BigNumber("18"));
