import React from "react";

const FyghtContext = React.createContext({});

export const FyghtProvider = FyghtContext.Provider;
export const FyghtConsumer = FyghtContext.Consumer;
export default FyghtContext;
