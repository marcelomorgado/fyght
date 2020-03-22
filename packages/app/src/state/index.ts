import { createStore, createHook, createContainer } from "react-sweet-state";
import {
  fetchAllEnemies,
  initializeMetamask,
  setMetamaskAccount,
  fetchMyFyghter,
  challengeAnEnemy,
  changeMyFyghterSkin,
  createFyghter,
  renameMyFyghter,
} from "./actions";

type State = FyghtContext;

const initialState: State = {
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

const actions = {
  fetchAllEnemies,
  initializeMetamask,
  setMetamaskAccount,
  fetchMyFyghter,
  challengeAnEnemy,
  changeMyFyghterSkin,
  createFyghter,
  renameMyFyghter,
};

type Actions = typeof actions;

const Store = createStore<State, Actions>({
  initialState,
  actions,
});

export const useFyghtState = createHook(Store);
const FyghtStateContainer = createContainer(Store);
