import { storeMocks } from "../testHelpers";
const { enemies } = storeMocks;

export const RENAME = "RENAME";
export const CHANGE_SKIN = "CHANGE_SKIN";
export const UPDATE_MY_FIGHTER_XP = "UPDATE_MY_FIGHTER_XP";
export const UPDATE_ENEMY_XP = "UPDATE_ENEMY_XP";
export const TOGGLE_INITIALIZED = "TOGGLE_INITIALIZED";
export const LOAD_ENEMIES = "LOAD_ENEMIES";
/*
import { Fyghters } from "../../contracts/Fyghters";
import { FyghtersFactory } from "../../contracts/FyghtersFactory";
import { ethers } from "ethers";

  // TODO: Move to a setup/env config
  const address: string = "0x49de9b5f6c0Dc3e22e9Af986477Cac01dBe82659";
  const provider = new ethers.providers.JsonRpcProvider();
  const fyghters: Fyghters = FyghtersFactory.connect(address, provider);

  console.log(fyghters.balanceOf("0x49de9b5f6c0Dc3e22e9Af986477Cac01dBe82659"));
  */

export const createActions = (dispatch: any, state: any) => {
  const renameMyFyghter = (name: string) =>
    dispatch({ type: RENAME, payload: { name } });

  const changeMyFyghterSkin = (skin: string) =>
    dispatch({ type: CHANGE_SKIN, payload: { skin } });

  const updateMyFyghterXp = (xp: number) =>
    dispatch({ type: UPDATE_MY_FIGHTER_XP, payload: { xp } });

  const updateEnemyXp = (enemyId: number, xp: number) =>
    dispatch({ type: UPDATE_ENEMY_XP, payload: { enemyId, xp } });

  const attackAnEnemy = (enemyId: number) => {
    const { myFyghter, enemies } = state;
    const [enemy] = enemies.filter((e: Fyghter) => e.id == enemyId);

    const winProbability = myFyghter.xp / (myFyghter.xp + enemy.xp);
    const random = Math.random();

    if (random < winProbability) {
      updateMyFyghterXp(myFyghter.xp + 1);
    } else {
      updateEnemyXp(enemy.id, enemy.xp + 1);
    }
  };

  const setEnemies = (enemies: Fyghter[]) => {
    dispatch({ type: LOAD_ENEMIES, payload: { enemies } });
  };

  // Note: WIP
  const loadEnemies = async () => {
    const es = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return enemies;
    };
    setEnemies(await es());
    dispatch({ type: TOGGLE_INITIALIZED, payload: {} });
  };

  return {
    renameMyFyghter,
    changeMyFyghterSkin,
    attackAnEnemy,
    loadEnemies,
  };
};
