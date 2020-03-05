import * as React from "react";
import { shallow } from "enzyme";

import { Header } from "./Header";

describe("Header", () => {
  test("should render the component", () => {
    expect(shallow(<Header />)).toMatchSnapshot();
  });
});
