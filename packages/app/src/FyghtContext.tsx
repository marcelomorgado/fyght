import React, { useReducer, useContext } from "react";
import { storeMocks } from "./testHelpers";

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

const FyghtContext = React.createContext<any | null>(null);

const initialState: FyghtContextInterface = {
  myFyghter: storeMocks.myFyghter,
  enemies: storeMocks.enemies,
};

//
// Reducers
//
const RENAME = "RENAME";
const CHANGE_SKIN = "CHANGE_SKIN";
const UPDATE_MY_FIGHTER_XP = "UPDATE_MY_FIGHTER_XP";

const myFyghterReducer = (
  state: Fyghter = initialState.myFyghter,
  action: { type: string; payload?: any }
): Fyghter => {
  const { type, payload } = action;
  const { name, skin, xp } = payload;

  switch (type) {
    case RENAME:
      return { ...state, name };
    case CHANGE_SKIN:
      return { ...state, skin };
    case UPDATE_MY_FIGHTER_XP:
      return { ...state, xp };
    default:
      return state;
  }
};

const UPDATE_ENEMY_XP = "UPDATE_ENEMY_XP";

const enemiesReducer = (
  state: Array<Fyghter> = initialState.enemies,
  action: { type: string; payload?: any }
): Array<Fyghter> => {
  const { type, payload } = action;
  const { enemyId, xp } = payload;

  switch (type) {
    case UPDATE_ENEMY_XP:
      return state.map(e => {
        if (e.id === enemyId) {
          return { ...e, xp };
        } else {
          return e;
        }
      });
    default:
      return state;
  }
};

const rootReducer = (
  state: FyghtContextInterface = initialState,
  action: any
): FyghtContextInterface => {
  const { myFyghter, enemies } = state;
  return {
    myFyghter: myFyghterReducer(myFyghter, action),
    enemies: enemiesReducer(enemies, action),
  };
};

const FyghtProvider = ({ children }: any) => {
  const [state, baseDispatch] = useReducer(rootReducer, initialState);

  const dispatch = React.useCallback(asyncer(baseDispatch, state), []);

  //
  // Actions
  //
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
    const [enemy] = enemies.filter(e => e.id == enemyId);

    const winProbability = myFyghter.xp / (myFyghter.xp + enemy.xp);
    const random = Math.random();

    if (random < winProbability) {
      updateMyFyghterXp(myFyghter.xp + 1);
    } else {
      updateEnemyXp(enemy.id, enemy.xp + 1);
    }
  };
  const actions = { renameMyFyghter, changeMyFyghterSkin, attackAnEnemy };

  return (
    <FyghtContext.Provider value={{ state, ...actions }}>
      {children}
    </FyghtContext.Provider>
  );
};

const asyncer = (dispatch: any, state: any) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

const useFyghtContext = () => useContext(FyghtContext);

export { FyghtProvider, useFyghtContext };
