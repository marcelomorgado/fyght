import { BigNumber } from "ethers/utils";

export const storeMocks = {
  myFyghter: {
    id: new BigNumber("1"),
    name: "John",
    // TODO: Skin as constant (?)
    skin: "normal_guy",
    xp: new BigNumber("5"),
  },
  enemies: [
    {
      id: new BigNumber("2"),
      name: "Charlie",
      // TODO: Skin as constant (?)
      skin: "naked",
      xp: new BigNumber("1"),
    },
    {
      id: new BigNumber("3"),
      name: "Saul",
      // TODO: Skin as constant (?)
      skin: "ninja",
      xp: new BigNumber("10"),
    },
    {
      id: new BigNumber("4"),
      name: "Julian",
      // TODO: Skin as constant (?)
      skin: "naked",
      xp: new BigNumber("1"),
    },
    {
      id: new BigNumber("5"),
      name: "Brad",
      // TODO: Skin as constant (?)
      skin: "master",
      xp: new BigNumber("89"),
    },
    {
      id: new BigNumber("6"),
      name: "Frank",
      // TODO: Skin as constant (?)
      skin: "no_one",
      xp: new BigNumber("71"),
    },
    {
      id: new BigNumber("7"),
      name: "Brian",
      // TODO: Skin as constant (?)
      skin: "monk",
      xp: new BigNumber("30"),
    },
    {
      id: new BigNumber("8"),
      name: "Fred",
      // TODO: Skin as constant (?)
      skin: "karate_kid",
      xp: new BigNumber("10"),
    },
  ],
};
