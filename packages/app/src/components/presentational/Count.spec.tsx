import * as React from "react";
import { shallow } from "enzyme";

import { Count } from "./Count";

describe("Count", () => {
  test("should render the component", () => {
    expect(shallow(<Count count={1} />)).toMatchSnapshot();
  });
});
