import {
  RENAME,
  CHANGE_SKIN,
  UPDATE_ENEMY_XP,
  UPDATE_MY_FIGHTER_XP,
  LOAD_ENEMIES,
  SET_MY_FYGHTER,
} from "./actions";

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

export const initialState: FyghtContextInterface = {
  myFyghter: null,
  enemies: [],
};

const myFyghterReducer = (
  state: Fyghter = initialState.myFyghter,
  action: { type: string; payload?: any }
): Fyghter => {
  const { type, payload } = action;
  const { name, skin, xp, myFyghter } = payload;

  switch (type) {
    case RENAME:
      return { ...state, name };
    case CHANGE_SKIN:
      return { ...state, skin };
    case UPDATE_MY_FIGHTER_XP:
      return { ...state, xp };
    case SET_MY_FYGHTER:
      return myFyghter;
    default:
      return state;
  }
};

const enemiesReducer = (
  state: Array<Fyghter> = initialState.enemies,
  action: { type: string; payload?: any }
): Array<Fyghter> => {
  const { type, payload } = action;
  const { enemyId, xp, enemies } = payload;

  switch (type) {
    case UPDATE_ENEMY_XP:
      return state.map(e => {
        if (e.id === enemyId) {
          return { ...e, xp };
        } else {
          return e;
        }
      });
    case LOAD_ENEMIES:
      return enemies;
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
