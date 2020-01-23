import * as React from "react";
import { shallow } from "enzyme";

import { JourneyTable } from "./JourneyTable";

describe("JourneyTable", () => {
  test("should render the component", () => {
    expect(shallow(<JourneyTable />)).toMatchSnapshot();
  });
});
