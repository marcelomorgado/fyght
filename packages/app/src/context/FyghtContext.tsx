import React, { useReducer, useContext } from "react";
import { createActions } from "./actions";
import { rootReducer, initialState } from "./reducers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FyghtContext = React.createContext<any | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncer = (dispatch: any, state: any) => (action: any): any =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

const FyghtProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [state, baseDispatch] = useReducer(rootReducer, initialState);

  const dispatch = React.useCallback(asyncer(baseDispatch, state), []);

  const actions = createActions(dispatch, state);

  return <FyghtContext.Provider value={{ state, ...actions }}>{children}</FyghtContext.Provider>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFyghtContext = (): any => useContext(FyghtContext);

export { FyghtProvider, useFyghtContext };
