import * as React from "react";
import { shallow } from "enzyme";

import { About } from "./About";

describe("About", () => {
  test("should render the component", () => {
    expect(shallow(<About />)).toMatchSnapshot();
  });
});
