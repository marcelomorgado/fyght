import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { MyFyghterContainer } from ".";
import { storeMocks } from "../../../testHelpers";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("MyFyghterContainer", () => {
  jest
    .spyOn(FyghtState, "useFyghtState")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockImplementation((): any => [{ myFyghter: storeMocks.myFyghter, metamask: { account: "" } }, {}]);

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
