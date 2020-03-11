import { ethers, ContractTransaction } from "ethers";
import { BigNumber } from "ethers/utils";
import { Fyghter, FyghtContextInterface } from "../global";
import { getAllEvents } from "../helpers";

export const RENAME = "RENAME";
export const CHANGE_SKIN = "CHANGE_SKIN";
export const INCREMENT_MY_FIGHTER_XP = "INCREMENT_MY_FIGHTER_XP";
export const INCREMENT_ENEMY_XP = "INCREMENT_ENEMY_XP";
export const LOAD_ENEMIES = "LOAD_ENEMIES";
export const SET_MY_FYGHTER = "SET_MY_FYGHTER";
export const UPDATE_METAMASK_ACCOUNT = "UPDATE_METAMASK_ACCOUNT";
export const UPDATE_METAMASK_NETWORK = "UPDATE_METAMASK_NETWORK";
export const INITIALIZE_METAMASK = "INITIALIZE_METAMASK";

export const createActions = (
  dispatch: any,
  state: FyghtContextInterface
): any => {
  const setMyFyghter = (myFyghter: Fyghter): void =>
    dispatch({ type: SET_MY_FYGHTER, payload: { myFyghter } });

  const renameMyFyghter = (name: string): void =>
    dispatch({ type: RENAME, payload: { name } });

  const changeMyFyghterSkin = (skin: string): void =>
    dispatch({ type: CHANGE_SKIN, payload: { skin } });

  const incrementMyFyghterXp = (): void =>
    dispatch({ type: INCREMENT_MY_FIGHTER_XP, payload: {} });

  const incrementEnemyXp = (enemyId: BigNumber): void =>
    dispatch({ type: INCREMENT_ENEMY_XP, payload: { enemyId } });

  const setEnemies = (enemies: Fyghter[]): void =>
    dispatch({ type: LOAD_ENEMIES, payload: { enemies } });

  const attackAnEnemy = async (enemyId: BigNumber): Promise<void> => {
    const {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters },
    } = state;

    try {
      // TODO: Also move other contract interactions to this file
      const tx: ContractTransaction = await fyghters.attack(
        myFyghterId,
        enemyId
      );
      await tx.wait();

      // TODO: Get event from transaction
      // TODO: Fix many events reading
      const filter = fyghters.filters.Attack(null, null, null);
      fyghters.on(
        filter,
        async (
          myFighterId: BigNumber,
          enemyId: BigNumber,
          winnerId: BigNumber
        ) => {
          if (winnerId.eq(myFighterId)) {
            incrementMyFyghterXp();
          } else {
            incrementEnemyXp(enemyId);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  //
  // Note: This low level code needed to get past events is the way that ethers.js v4 works
  // See more: https://github.com/marcelomorgado/fyght/issues/78
  //
  const loadEnemies = async (): Promise<void> => {
    const {
      metamask: { contract: fyghters, provider, account },
    } = state;

    if (!fyghters || !provider) {
      setEnemies([]);
      return;
    }

    const topic = ethers.utils.id("NewFyghter(address,uint256,string)");
    const events = await getAllEvents(fyghters, topic);
    const enemiesIds = events
      .filter(
        (event: any) =>
          ethers.utils.getAddress(event.owner) !==
          ethers.utils.getAddress(account)
      )
      .map((event: any) => event.id);

    const enemiesPromises = enemiesIds.map(id => fyghters.fyghters(id));
    const enemies: Fyghter[] = await Promise.all(enemiesPromises);

    setEnemies(enemies);
  };

  const loadMyFyghter = async (): Promise<void> => {
    const {
      metamask: { contract: fyghters, account },
    } = state;

    const topic = ethers.utils.id("NewFyghter(address,uint256,string)");
    const events = await getAllEvents(fyghters, topic);
    const [myFyghterId] = events
      .filter(
        (event: any) =>
          ethers.utils.getAddress(event.owner) ===
          ethers.utils.getAddress(account)
      )
      .map((event: any) => event.id);

    if (myFyghterId) {
      const myFyghter = await fyghters.fyghters(myFyghterId);
      setMyFyghter(myFyghter);
    }
  };

  const initializeMetamask = (): void =>
    dispatch({ type: INITIALIZE_METAMASK, payload: {} });

  const setMetamaskAccount = (account: string): void =>
    dispatch({ type: UPDATE_METAMASK_ACCOUNT, payload: { account } });

  const setMetamaskNetworkId = (networkId: number): void =>
    dispatch({ type: UPDATE_METAMASK_NETWORK, payload: { networkId } });

  return {
    renameMyFyghter,
    changeMyFyghterSkin,
    attackAnEnemy,
    loadEnemies,
    loadMyFyghter,
    setMetamaskAccount,
    setMetamaskNetworkId,
    initializeMetamask,
    setMyFyghter,
  };
};
