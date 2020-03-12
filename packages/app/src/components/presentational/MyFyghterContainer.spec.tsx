import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { MyFyghterContainer } from "./MyFyghterContainer";
import { storeMocks } from "../../testHelpers";

// TODO: Create a alread loaded test case
describe("MyFyghterContainer", () => {
  test("should render the component", () => {
    const contextValues = { state: { myFyghter: storeMocks.myFyghter } };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(shallow(<MyFyghterContainer />)).toMatchSnapshot();
  });
});
