import {
  RENAME,
  CHANGE_SKIN,
  UPDATE_ENEMY_XP,
  UPDATE_MY_FIGHTER_XP,
} from "./actions";
import { storeMocks } from "../testHelpers";
const { myFyghter, enemies } = storeMocks;

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

export const initialState: FyghtContextInterface = {
  myFyghter,
  enemies,
};

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

export const rootReducer = (
  state: FyghtContextInterface = initialState,
  action: any
): FyghtContextInterface => {
  const { myFyghter, enemies } = state;
  return {
    myFyghter: myFyghterReducer(myFyghter, action),
    enemies: enemiesReducer(enemies, action),
  };
};
