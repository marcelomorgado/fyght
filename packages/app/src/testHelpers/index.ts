import { BigNumber } from "ethers";
import { Skin } from "../constants";

export const storeMocks: { myFyghter: Fyghter; enemies: Enemy[] } = {
  myFyghter: {
    id: BigNumber.from("1"),
    name: "John",
    skin: Skin.NORMAL_GUY,
    xp: BigNumber.from("5"),
    balance: BigNumber.from("5"),
  },
  enemies: [
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("2"),
        name: "Charlie",
        skin: Skin.NAKED,
        xp: BigNumber.from("1"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("3"),
        name: "Saul",
        skin: Skin.NINJA,
        xp: BigNumber.from("10"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("4"),
        name: "Julian",
        skin: Skin.NAKED,
        xp: BigNumber.from("1"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("5"),
        name: "Brad",
        skin: Skin.MASTER,
        xp: BigNumber.from("89"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("6"),
        name: "Frank",
        skin: Skin.NO_ONE,
        xp: BigNumber.from("71"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("7"),
        name: "Brian",
        skin: Skin.MONK,
        xp: BigNumber.from("30"),
        balance: BigNumber.from("5"),
      },
    },
    {
      winProbability: BigNumber.from("50"),
      fyghter: {
        id: BigNumber.from("8"),
        name: "Fred",
        skin: Skin.KARATE_KID,
        xp: BigNumber.from("10"),
        balance: BigNumber.from("5"),
      },
    },
  ],
};
