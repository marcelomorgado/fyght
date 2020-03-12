import * as React from "react";
import { render } from "react-dom";
import FyghtScreen from "./components/screens/FyghtScreen";
import { FyghtProvider } from "./store";

render(
  <FyghtProvider>
    <FyghtScreen />
  </FyghtProvider>,
  document.getElementById("main")
);
