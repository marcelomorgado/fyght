import { StoreActionApi } from "react-sweet-state";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const setErrorMessage = (errorMessage: string) => ({ setState, getState }: StoreApi): void => {
  const { messages } = getState();
  setState({ messages: { ...messages, errorMessage } });
};

export const setInfoMessage = (infoMessage: string) => ({ setState, getState }: StoreApi): void => {
  const { messages } = getState();
  setState({ messages: { ...messages, infoMessage } });
};
