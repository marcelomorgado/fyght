import { createStore, createHook } from "react-sweet-state";
import * as actions from "./actions";
import { BigNumber } from "ethers/utils";

type State = FyghtState;
type Actions = typeof actions;

const initialState: State = {
  myFyghter: null,
  enemies: [],
  messages: { errorMessage: null, infoMessage: null },
  metamask: {
    networkId: null,
    loomAccount: null,
    ethereum: null,
    contracts: { fyghters: null, dai: null },
    provider: null,
    loading: true,
  },
  balance: { amount: new BigNumber(0), loading: false },
};

const Store = createStore<State, Actions>({
  initialState,
  actions,
});

export const useFyghtState = createHook(Store);
