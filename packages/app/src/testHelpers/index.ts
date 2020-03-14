import { BigNumber } from "ethers";
import { Skin } from "../constants";

export const storeMocks: { myFyghter: Fyghter; enemies: Fyghter[] } = {
  myFyghter: {
    id: BigNumber.from("1"),
    name: "John",
    skin: Skin.NORMAL_GUY,
    xp: BigNumber.from("5"),
  },
  enemies: [
    {
      id: BigNumber.from("2"),
      name: "Charlie",
      skin: Skin.NAKED,
      xp: BigNumber.from("1"),
    },
    {
      id: BigNumber.from("3"),
      name: "Saul",
      skin: Skin.NINJA,
      xp: BigNumber.from("10"),
    },
    {
      id: BigNumber.from("4"),
      name: "Julian",
      skin: Skin.NAKED,
      xp: BigNumber.from("1"),
    },
    {
      id: BigNumber.from("5"),
      name: "Brad",
      skin: Skin.MASTER,
      xp: BigNumber.from("89"),
    },
    {
      id: BigNumber.from("6"),
      name: "Frank",
      skin: Skin.NO_ONE,
      xp: BigNumber.from("71"),
    },
    {
      id: BigNumber.from("7"),
      name: "Brian",
      skin: Skin.MONK,
      xp: BigNumber.from("30"),
    },
    {
      id: BigNumber.from("8"),
      name: "Fred",
      skin: Skin.KARATE_KID,
      xp: BigNumber.from("10"),
    },
  ],
};
