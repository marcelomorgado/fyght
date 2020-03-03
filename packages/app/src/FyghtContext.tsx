import React, { useReducer } from "react";

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

const FyghtContext = React.createContext<any | null>(null);

const initialState: FyghtContextInterface = {
  myFyghter: {
    id: 1,
    name: "John",
    skin: "naked",
    xp: 2,
    winCount: 4,
    lossCount: 5,
  },
  enemies: [
    {
      id: 2,
      name: "Charlie",
      // TODO: Skin as constant (?)
      skin: "normal_guy",
      xp: 1,
      winCount: 3,
      lossCount: 4,
    },
  ],
};

const enemiesReducer = (
  state: Array<Fyghter> = initialState.enemies,
  action: { type: string; payload?: any }
): Array<Fyghter> => {
  const { type } = action;

  switch (type) {
    case "TODO":
      return state;
    default:
      return state;
  }
};

const myFyghterReducer = (
  state: Fyghter = initialState.myFyghter,
  action: { type: string; payload?: any }
): Fyghter => {
  const { type, payload } = action;
  const { name } = payload;
  switch (type) {
    case "RENAME":
      return { ...state, name };
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

  return (
    <FyghtContext.Provider value={{ state, dispatch }}>
      {children}
    </FyghtContext.Provider>
  );
};

const asyncer = (dispatch: any, state: any) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

const { Consumer: FyghtConsumer } = FyghtContext;
export { FyghtProvider, FyghtConsumer };
export default FyghtContext;
