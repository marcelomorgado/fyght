import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { MyFyghterContainer } from "./MyFyghterContainer";
import { storeMocks } from "../../testHelpers";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("MyFyghterContainer", () => {
  const contextValues = {
    state: { myFyghter: storeMocks.myFyghter, metamask: { account: "" } },
  };
  jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

  test("loading", () => {
    const stateValues = [true, jest.fn()];
    (useStateMock as jest.Mock).mockImplementation(() => stateValues);

    expect(shallow(<MyFyghterContainer />)).toMatchSnapshot();
  });

  test("after loading", () => {
    const stateValues = [false, jest.fn()];
    (useStateMock as jest.Mock).mockImplementation(() => stateValues);

    expect(shallow(<MyFyghterContainer />)).toMatchSnapshot();
  });
});
