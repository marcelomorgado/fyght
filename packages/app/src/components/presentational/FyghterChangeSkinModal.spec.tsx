import * as React from "react";
import { shallow } from "enzyme";

import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";

describe("FyghterChangeSkinModal", () => {
  test("should render the component", () => {
    expect(shallow(<FyghterChangeSkinModal />)).toMatchSnapshot();
  });
});
