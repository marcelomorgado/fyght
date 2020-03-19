import { Skin } from "../constants";
import { ethers, BigNumber } from "ethers";

export const skins = [
  {
    skin: Skin.NAKED,
    level: "Naked",
    description: "You are ready to begin your journey when you let go all of material stuffs",
    unlock: "-",
  },
  {
    skin: Skin.NORMAL_GUY,
    level: "Normal Guy",
    description: "You are a new man now",
    unlock: "10 XP",
  },
  {
    skin: Skin.KARATE_KID,
    level: "Karate Kid",
    description: "Now people respect you",
    unlock: "15 XP",
  },
  {
    skin: Skin.JAPONESE,
    level: "Japonese",
    description: "In the land of the rising sun new knowledges are discovered",
    unlock: "25 XP",
  },
  {
    skin: Skin.MONK,
    level: "Monk",
    description: "Secret powers and wisdoms are achieve",
    unlock: "40 XP",
  },
  {
    skin: Skin.NINJA,
    level: "Ninja",
    description: "Secret powers and wisdoms are achieve",
    unlock: "50 XP",
  },
  {
    skin: Skin.NO_ONE,
    level: "No One",
    description: "Valar dohaeris",
    unlock: "80 XP",
  },
  {
    skin: Skin.DEMON,
    level: "Demon",
    description: "Anyone means anyone",
    unlock: "80 XP",
  },
  {
    skin: Skin.MASTER,
    level: "Master",
    description: "Try not, do or do not",
    unlock: "100 XP",
  },
];

export const formatDai = (wei: BigNumber): string => `$${ethers.utils.formatEther(wei)}`;
export const formatPercent = (value: BigNumber): string => {
  if (!value) return "N/A";
  const percent = ethers.utils.formatEther(value);
  return `${percent}%`;
};
