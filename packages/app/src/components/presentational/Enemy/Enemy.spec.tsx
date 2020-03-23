import * as React from "react";
import { shallow } from "enzyme";
import { storeMocks } from "../../../testHelpers";
import { Enemy } from ".";

const { enemies, myFyghter } = storeMocks;

describe("Enemy", () => {
  test("should render the component", () => {
    const [enemy] = enemies;
    expect(shallow(<Enemy enemy={enemy} myFyghter={myFyghter} />)).toMatchSnapshot();
  });
});
