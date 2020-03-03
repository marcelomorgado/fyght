import React, { useReducer, useContext } from "react";
import { stateMocks } from "./testHelpers";

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

const FyghtContext = React.createContext<any | null>(null);

const initialState: FyghtContextInterface = {
  myFyghter: stateMocks.myFyghter,
  enemies: stateMocks.enemies,
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
  const { name, skin } = payload;
  switch (type) {
    case "RENAME":
      return { ...state, name };
    case "CHANGE_SKIN":
      return { ...state, skin };
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

  const renameMyFyghter = (name: string) =>
    dispatch({ type: "RENAME", payload: { name } });

  const changeMyFyghterSkin = (skin: string) =>
    dispatch({ type: "CHANGE_SKIN", payload: { skin } });

  return (
    <FyghtContext.Provider
      value={{ state, renameMyFyghter, changeMyFyghterSkin }}
    >
      {children}
    </FyghtContext.Provider>
  );
};

const asyncer = (dispatch: any, state: any) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

const { Consumer: FyghtConsumer } = FyghtContext;
const useFyghtContext = () => useContext(FyghtContext);

export { FyghtProvider, FyghtConsumer, useFyghtContext };

export default FyghtContext;
