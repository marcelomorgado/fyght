import React from "react";

interface FyghtContextInterface {
  myFyghter: Fyghter;
  enemies: Array<Fyghter>;
}

const FyghtContext = React.createContext<FyghtContextInterface | null>(null);
export const {
  Provider: FyghtProvider,
  Consumer: FyghtConsumer,
} = FyghtContext;

// export const FyghtProvider = FyghtContext.Provider;
// export const FyghtConsumer = FyghtContext.Consumer;
export default FyghtContext;
