import React, { useReducer, useContext } from "react";
import { createActions } from "./actions";
import { rootReducer, initialState } from "./reducers";

const FyghtContext = React.createContext<any | null>(null);

const asyncer = (dispatch: any, state: any) => (action: any) =>
  typeof action === "function" ? action(dispatch, state) : dispatch(action);

const FyghtProvider = ({ children }: any) => {
  const [state, baseDispatch] = useReducer(rootReducer, initialState);

  const dispatch = React.useCallback(asyncer(baseDispatch, state), []);

  const actions = createActions(dispatch, state);

  return (
    <FyghtContext.Provider value={{ state, ...actions }}>
      {children}
    </FyghtContext.Provider>
  );
};

const useFyghtContext = () => useContext(FyghtContext);

export { FyghtProvider, useFyghtContext };
