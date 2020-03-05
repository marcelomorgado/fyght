import * as React from "react";
import { shallow } from "enzyme";
import { storeMocks } from "../../testHelpers";
import { Enemy } from "./Enemy";

describe("Enemy", () => {
  test("should render the component", () => {
    const { enemies } = storeMocks;
    const [enemy] = enemies;
    expect(shallow(<Enemy enemy={enemy} />)).toMatchSnapshot();
  });
});
