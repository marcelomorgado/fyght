import { Skin } from "../constants";

export const skins = [
  {
    skin: Skin.NAKED,
    level: Skin.NAKED,
    description:
      "You are ready to begin your journey when you let go all of material stuffs",
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
    level: Skin.MONK,
    description: "Secret powers and wisdoms are achieve",
    unlock: "40 XP",
  },
  {
    skin: Skin.NINJA,
    level: Skin.NINJA,
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
    skin: Skin.DAEMON,
    level: "Damon",
    description: "Anyone means anyone",
    unlock: "80 XP",
  },
  {
    skin: Skin.MASTER,
    level: Skin.MASTER,
    description: "Try not, do or do not",
    unlock: "100 XP",
  },
];

export const getAllEvents = async (contract: any, topic: any): Promise<any> => {
  const filter = {
    address: contract.address,
    fromBlock: 0,
    toBlock: "latest",
    topics: [topic],
  };
  const logs = await contract.provider.getLogs(filter);
  return logs
    .map((log: any) => contract.interface.parseLog(log))
    .map((parsedLog: any) => parsedLog.values);
};
