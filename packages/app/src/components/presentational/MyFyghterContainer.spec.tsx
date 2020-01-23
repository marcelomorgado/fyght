import * as React from "react";
import { shallow } from "enzyme";

import { MyFyghterContainer } from "./MyFyghterContainer";

describe("MyFyghterContainer", () => {
  test("should render the component", () => {
    expect(shallow(<MyFyghterContainer />)).toMatchSnapshot();
  });
});
