import { FyghtersFactory } from "../contracts/FyghtersFactory";
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export const RENAME = "RENAME";
export const CHANGE_SKIN = "CHANGE_SKIN";
export const UPDATE_MY_FIGHTER_XP = "UPDATE_MY_FIGHTER_XP";
export const UPDATE_ENEMY_XP = "UPDATE_ENEMY_XP";
export const TOGGLE_INITIALIZED = "TOGGLE_INITIALIZED";
export const LOAD_ENEMIES = "LOAD_ENEMIES";

// TODO: Move to a setup/env config
const FYGHTERS_CONTRACT_ADDRESS: string =
  "0x49de9b5f6c0Dc3e22e9Af986477Cac01dBe82659";
const provider = new ethers.providers.JsonRpcProvider();
const fyghters: Fyghters = FyghtersFactory.connect(
  FYGHTERS_CONTRACT_ADDRESS,
  provider
);

export const createActions = (dispatch: any, state: any) => {
  const renameMyFyghter = (name: string) =>
    dispatch({ type: RENAME, payload: { name } });

  const changeMyFyghterSkin = (skin: string) =>
    dispatch({ type: CHANGE_SKIN, payload: { skin } });

  const updateMyFyghterXp = (xp: BigNumber) =>
    dispatch({ type: UPDATE_MY_FIGHTER_XP, payload: { xp } });

  const updateEnemyXp = (enemyId: BigNumber, xp: BigNumber) =>
    dispatch({ type: UPDATE_ENEMY_XP, payload: { enemyId, xp } });

  const attackAnEnemy = (enemyId: BigNumber) => {
    const { myFyghter, enemies } = state;
    const [enemy] = enemies.filter((e: Fyghter) => e.id == enemyId);

    const winProbability = (myFyghter.xp / (myFyghter.xp + enemy.xp)) * 10;
    console.log(`winProbability=${winProbability}`);
    const random = Math.random();
    console.log(`random=${random}`);

    if (random < winProbability) {
      updateMyFyghterXp(myFyghter.xp.add(new BigNumber("1")));
    } else {
      updateEnemyXp(enemy.id, enemy.xp.add(new BigNumber("1")));
    }
  };

  const setEnemies = (enemies: Fyghter[]) => {
    dispatch({ type: LOAD_ENEMIES, payload: { enemies } });
  };

  //
  // Note: This low level code needed to get past events is the way that ethers.js v4 works
  // See more: https://github.com/marcelomorgado/fyght/issues/78
  //
  const loadEnemies = async () => {
    // TODO: Extract this code to a generic utils function
    const topic = ethers.utils.id("NewFyghter(uint256,string)");
    const filter = {
      address: fyghters.address,
      fromBlock: 0,
      toBlock: await provider.getBlockNumber(),
      topics: [topic],
    };
    const logs = await provider.getLogs(filter);
    const enemiesIds = logs
      .map(log => fyghters.interface.parseLog(log))
      .map(l => l.values)
      .map(e => e.id);

    const enemiesPromises = enemiesIds.map(id => fyghters.fyghters(id));
    const enemies: Fyghter[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
    dispatch({ type: TOGGLE_INITIALIZED, payload: {} });
  };

  return {
    renameMyFyghter,
    changeMyFyghterSkin,
    attackAnEnemy,
    loadEnemies,
  };
};
