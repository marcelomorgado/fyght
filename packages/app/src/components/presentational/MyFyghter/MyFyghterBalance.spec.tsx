import * as React from "react";
import { shallow } from "enzyme";
import { MyFyghterBalance } from "./MyFyghterBalance";
import { ONE } from "../../../constants";

describe("MyFyghterBalance", () => {
  test("should render the component", () => {
    expect(shallow(<MyFyghterBalance value={ONE} />)).toMatchSnapshot();
  });
});
