import { BigNumber } from "ethers/utils";
import { Skin } from "../constants";
import { Fyghter } from "../global";

export const storeMocks: { myFyghter: Fyghter; enemies: Fyghter[] } = {
  myFyghter: {
    id: new BigNumber("1"),
    name: "John",
    skin: Skin.NORMAL_GUY,
    xp: new BigNumber("5"),
  },
  enemies: [
    {
      id: new BigNumber("2"),
      name: "Charlie",
      skin: Skin.NAKED,
      xp: new BigNumber("1"),
    },
    {
      id: new BigNumber("3"),
      name: "Saul",
      skin: Skin.NINJA,
      xp: new BigNumber("10"),
    },
    {
      id: new BigNumber("4"),
      name: "Julian",
      skin: Skin.NAKED,
      xp: new BigNumber("1"),
    },
    {
      id: new BigNumber("5"),
      name: "Brad",
      skin: Skin.MASTER,
      xp: new BigNumber("89"),
    },
    {
      id: new BigNumber("6"),
      name: "Frank",
      skin: Skin.NO_ONE,
      xp: new BigNumber("71"),
    },
    {
      id: new BigNumber("7"),
      name: "Brian",
      skin: Skin.MONK,
      xp: new BigNumber("30"),
    },
    {
      id: new BigNumber("8"),
      name: "Fred",
      skin: Skin.KARATE_KID,
      xp: new BigNumber("10"),
    },
  ],
};
