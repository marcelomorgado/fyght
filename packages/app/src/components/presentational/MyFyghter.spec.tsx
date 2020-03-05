import * as React from "react";
import { shallow } from "enzyme";
import { storeMocks } from "../../testHelpers";
import { MyFyghter } from "./MyFyghter";

describe("MyFyghter", () => {
  test("should render the component", () => {
    const { myFyghter } = storeMocks;
    expect(shallow(<MyFyghter fyghter={myFyghter} />)).toMatchSnapshot();
  });
});
