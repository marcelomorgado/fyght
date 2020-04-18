import { createStore, createHook } from "react-sweet-state";
import * as actions from "./actions";
import { BigNumber } from "ethers/utils";

type State = FyghtState;
type Actions = typeof actions;

const initialState: State = {
  myFyghter: null,
  enemies: [],
  metamask: {
    networkId: null,
    ethereumAccount: null,
    loomAccount: null,
    ethereum: null,
    contracts: { fyghters: null, loomDai: null, ethereumDai: null, ethereumGateway: null, loomGateway: null },
    loomProvider: null,
    loomClient: null,
    ethereumProvider: null,
    loading: true,
  },
  daiBalances: {
    ethereumBalance: { amount: new BigNumber(0), loading: false },
    loomBalance: { amount: new BigNumber(0), loading: false },
  },
};

const Store = createStore<State, Actions>({
  initialState,
  actions,
});

export const useFyghtState = createHook(Store);
