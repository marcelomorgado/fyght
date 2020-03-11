import { ethers } from "ethers";
import { FyghtersFactory } from "../contracts/FyghtersFactory";
import { Fyghters } from "../contracts/Fyghters";
import {
  RENAME,
  CHANGE_SKIN,
  UPDATE_ENEMY_XP,
  UPDATE_MY_FIGHTER_XP,
  LOAD_ENEMIES,
  SET_MY_FYGHTER,
  UPDATE_METAMASK_ACCOUNT,
  UPDATE_METAMASK_NETWORK,
  INITIALIZE_METAMASK,
} from "./actions";
import { Metamask, Fyghter, Action, FyghtContextInterface } from "../global";

declare global {
  interface Window {
    // TODO: Set properly type
    ethereum: any;
  }
}

const { ethereum } = window;
ethereum.autoRefreshOnNetworkChange = false;

export const initialState: FyghtContextInterface = {
  myFyghter: null,
  enemies: [],
  metamask: {
    networkId: ethereum.networkVersion,
    account: null,
    ethereum,
    contract: null,
    provider: null,
  },
};

const myFyghterReducer = (
  state: Fyghter = initialState.myFyghter,
  action: Action
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
  action: Action
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

const metamaskReducer = (
  state: Metamask = initialState.metamask,
  action: Action
): Metamask => {
  const { type, payload } = action;
  const { networkId, account } = payload;

  switch (type) {
    case UPDATE_METAMASK_ACCOUNT:
      return { ...state, account };
    case UPDATE_METAMASK_NETWORK:
      return { ...state, networkId };
    case INITIALIZE_METAMASK: {
      const { ethereum } = state;
      // TODO: Move to a setup/env config
      const FYGHTERS_CONTRACT_ADDRESS =
        "0x49de9b5f6c0Dc3e22e9Af986477Cac01dBe82659";
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract: Fyghters = FyghtersFactory.connect(
        FYGHTERS_CONTRACT_ADDRESS,
        // TODO: Change signer when accounts change
        provider.getSigner()
      );

      return { ...state, contract, provider, ethereum };
    }
    default:
      return state;
  }
};

export const rootReducer = (
  state: FyghtContextInterface = initialState,
  action: Action
): FyghtContextInterface => {
  const { myFyghter, enemies, metamask } = state;
  return {
    myFyghter: myFyghterReducer(myFyghter, action),
    enemies: enemiesReducer(enemies, action),
    metamask: metamaskReducer(metamask, action),
  };
};
