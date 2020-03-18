import {
  RENAME,
  CHANGE_SKIN,
  INCREMENT_ENEMY_XP,
  INCREMENT_MY_FIGHTER_XP,
  LOAD_ENEMIES,
  SET_MY_FYGHTER,
  UPDATE_METAMASK_ACCOUNT,
  UPDATE_METAMASK_NETWORK,
  INITIALIZE_METAMASK,
  SET_ERROR_MESSAGE,
} from "./actions";
import { BigNumber } from "ethers";

export const initialState: FyghtContext = {
  myFyghter: null,
  enemies: [],
  errorMessage: null,
  metamask: {
    networkId: null,
    account: null,
    ethereum: null,
    contract: null,
    provider: null,
    loading: true,
  },
};

const myFyghterReducer = (state: Fyghter = initialState.myFyghter, action: Action): Fyghter => {
  const { type, payload } = action;
  const { name, skin, myFyghter } = payload;

  switch (type) {
    case RENAME:
      return { ...state, name };
    case CHANGE_SKIN:
      return { ...state, skin };
    case INCREMENT_MY_FIGHTER_XP:
      return {
        ...state,
        xp: BigNumber.from(state.xp).add(BigNumber.from("1")),
      };
    case SET_MY_FYGHTER:
      return myFyghter;
    default:
      return state;
  }
};

const enemiesReducer = (state: Array<Fyghter> = initialState.enemies, action: Action): Array<Fyghter> => {
  const { type, payload } = action;
  const { enemyId, enemies } = payload;

  switch (type) {
    case INCREMENT_ENEMY_XP:
      return state.map(e => {
        if (e.id.eq(enemyId)) {
          return { ...e, xp: BigNumber.from(e.xp).add(BigNumber.from("1")) };
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

const errorMessageReducer = (state: string, action: Action): string => {
  const { type, payload } = action;
  const { errorMessage } = payload;
  switch (type) {
    case SET_ERROR_MESSAGE:
      return errorMessage;
    default:
      return state;
  }
};

const metamaskReducer = (state: MetamaskContext = initialState.metamask, action: Action): MetamaskContext => {
  const { type, payload } = action;
  const { networkId, account, ethereum, contract, provider } = payload;

  switch (type) {
    case UPDATE_METAMASK_ACCOUNT:
      return { ...state, account };
    case UPDATE_METAMASK_NETWORK:
      return { ...state, networkId };
    case INITIALIZE_METAMASK: {
      return {
        ...state,
        account,
        contract,
        provider,
        ethereum,
        networkId,
        loading: false,
      };
    }
    default:
      return state;
  }
};

export const rootReducer = (state: FyghtContext = initialState, action: Action): FyghtContext => {
  const { myFyghter, enemies, errorMessage, metamask } = state;
  return {
    myFyghter: myFyghterReducer(myFyghter, action),
    enemies: enemiesReducer(enemies, action),
    errorMessage: errorMessageReducer(errorMessage, action),
    metamask: metamaskReducer(metamask, action),
  };
};
