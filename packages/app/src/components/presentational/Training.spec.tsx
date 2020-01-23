import * as React from "react";
import { shallow } from "enzyme";

import { Training } from "./Training";

describe("Training", () => {
  test("should render the component", () => {
    expect(shallow(<Training trainingCost={1} />)).toMatchSnapshot();
  });
});
