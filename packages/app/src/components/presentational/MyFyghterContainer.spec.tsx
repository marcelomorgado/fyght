import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../FyghtContext";
import { MyFyghterContainer } from "./MyFyghterContainer";
import { stateMocks } from "../../testHelpers";

describe("MyFyghterContainer", () => {
  test("should render the component", () => {
    const contextValues = { state: { myFyghter: stateMocks.myFyghter } };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(shallow(<MyFyghterContainer />)).toMatchSnapshot();
  });
});
