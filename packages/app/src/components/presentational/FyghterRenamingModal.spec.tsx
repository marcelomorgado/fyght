import * as React from "react";
import { shallow } from "enzyme";

import { FyghterRenamingModal } from "./FyghterRenamingModal";

describe("FyghterRenamingModal", () => {
  test("should render the component", () => {
    expect(shallow(<FyghterRenamingModal />)).toMatchSnapshot();
  });
});
