import { Skin } from "../constants";
import { ContractReceipt, Event, Contract } from "ethers";

export const skins = [
  {
    skin: Skin.NAKED,
    level: "Naked",
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
    skin: Skin.DAEMON,
    level: "Damon",
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

// export const getTransactionEvents = (
//   contract: Contract,
//   receipt: ContractReceipt
// ): { [eventName: string]: Event } => {
//   const txEvents: { [eventName: string]: Event } = {};

//   // for each log in the transaction receipt
//   for (const log of receipt.logs) {
//     // for each event in the ABI
//     for (const abiEvent of Object.values(contract.interface.events)) {
//       // if the hash of the ABI event equals the tx receipt log
//       if (abiEvent.topics[0] == log.topics[0]) {
//         // Parse the event from the log topics and data
//         txEvents[abiEvent.name] = abiEvent.parse(log.topics, log.data);

//         // stop looping through the ABI events
//         break;
//       }
//     }
//   }

//   return txEvents;
// };
