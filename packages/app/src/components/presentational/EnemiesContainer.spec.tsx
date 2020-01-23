import * as React from "react";
import { shallow } from "enzyme";

import { EnemiesContainer } from "./EnemiesContainer";

describe("EnemiesContainer", () => {
  test("should render the component", () => {
    expect(shallow(<EnemiesContainer />)).toMatchSnapshot();
  });
});
