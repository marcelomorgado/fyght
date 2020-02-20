import * as React from "react";
import { shallow } from "enzyme";

import { AttackModal } from "./AttackModal";

describe("AttackModal", () => {
  test("should render the component", () => {
    expect(shallow(<AttackModal />)).toMatchSnapshot();
  });
});
