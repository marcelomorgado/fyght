import { message } from "antd";

export const setErrorMessage = (errorMessage: string) => (): void => {
  message.error(errorMessage);
};

export const setInfoMessage = (infoMessage: string) => (): void => {
  message.info(infoMessage);
};
