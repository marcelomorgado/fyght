import {
  RENAME,
  CHANGE_SKIN,
  SET_ENEMIES,
  SET_MY_FYGHTER,
  UPDATE_METAMASK_ACCOUNT,
  UPDATE_METAMASK_NETWORK,
  INITIALIZE_METAMASK,
  SET_ERROR_MESSAGE,
  SET_INFO_MESSAGE,
} from "./actions";

export const initialState: FyghtContext = {
  myFyghter: null,
  enemies: [],
  messages: { errorMessage: null, infoMessage: null },
  metamask: {
    networkId: null,
    account: null,
    ethereum: null,
    contracts: { fyghters: null, dai: null },
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
    case SET_MY_FYGHTER:
      return myFyghter;
    default:
      return state;
  }
};

const enemiesReducer = (state: Array<Enemy> = initialState.enemies, action: Action): Array<Enemy> => {
  const { type, payload } = action;
  const { enemies } = payload;

  switch (type) {
    case SET_ENEMIES:
      return enemies;
    default:
      return state;
  }
};

const messagesReducer = (state: Messages, action: Action): Messages => {
  const { type, payload } = action;
  const { errorMessage, infoMessage } = payload;
  switch (type) {
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage };
    case SET_INFO_MESSAGE:
      return { ...state, infoMessage };
    default:
      return state;
  }
};

const metamaskReducer = (state: MetamaskContext = initialState.metamask, action: Action): MetamaskContext => {
  const { type, payload } = action;
  const { networkId, account, ethereum, contracts, provider } = payload;

  switch (type) {
    case UPDATE_METAMASK_ACCOUNT:
      return { ...state, account };
    case UPDATE_METAMASK_NETWORK:
      return { ...state, networkId };
    case INITIALIZE_METAMASK: {
      return {
        ...state,
        account,
        contracts,
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
  const { myFyghter, enemies, messages, metamask } = state;
  return {
    myFyghter: myFyghterReducer(myFyghter, action),
    enemies: enemiesReducer(enemies, action),
    messages: messagesReducer(messages, action),
    metamask: metamaskReducer(metamask, action),
  };
};
