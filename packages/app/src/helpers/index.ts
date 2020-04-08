import { Skin, ONE, BET_VALUE } from "../constants";
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";
import numeral from "numeral";

export const skins = [
  {
    skin: Skin.NAKED,
    level: "Naked",
    description: "You are ready to begin your journey when you let go all of material stuffs",
    unlock: "-",
    xpNeeded: 1,
  },
  {
    skin: Skin.NORMAL_GUY,
    level: "Normal Guy",
    description: "You are a new man now",
    unlock: "10 XP",
    xpNeeded: 10,
  },
  {
    skin: Skin.KARATE_KID,
    level: "Karate Kid",
    description: "Now people respect you",
    unlock: "15 XP",
    xpNeeded: 15,
  },
  {
    skin: Skin.JAPONESE,
    level: "Japonese",
    description: "In the land of the rising sun new knowledges are discovered",
    unlock: "25 XP",
    xpNeeded: 25,
  },
  {
    skin: Skin.MONK,
    level: "Monk",
    description: "Secret powers and wisdoms are achieve",
    unlock: "40 XP",
    xpNeeded: 40,
  },
  {
    skin: Skin.NINJA,
    level: "Ninja",
    description: "Secret powers and wisdoms are achieve",
    unlock: "50 XP",
    xpNeeded: 50,
  },
  {
    skin: Skin.NO_ONE,
    level: "No One",
    description: "Valar dohaeris",
    unlock: "80 XP",
    xpNeeded: 80,
  },
  {
    skin: Skin.DEMON,
    level: "Demon",
    description: "Anyone means anyone",
    unlock: "80 XP",
    xpNeeded: 80,
  },
  {
    skin: Skin.MASTER,
    level: "Master",
    description: "Try not, do or do not",
    unlock: "100 XP",
    xpNeeded: 100,
  },
];

export const formatWei = (wei: BigNumber): string => ethers.utils.formatEther(wei);
export const formatDai = (wei: BigNumber): string => numeral(formatWei(wei)).format("$0,0.00");
export const formatPercent = (value: BigNumber): string => numeral(formatWei(value)).format("0.00%");

export const calculateGainAndLoss = (winProbability: BigNumber): { gainIfWin: BigNumber; lossIfLose: BigNumber } => {
  const probability = winProbability ? winProbability : new BigNumber("0");
  const gainIfWin = new BigNumber(BET_VALUE).mul(new BigNumber(ONE).sub(probability)).div(ONE);
  const lossIfLose = new BigNumber(BET_VALUE).mul(probability).div(new BigNumber(ONE)).mul(new BigNumber(-1));
  return { gainIfWin, lossIfLose };
};
