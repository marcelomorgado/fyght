import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../context";
import { EnemiesContainer } from "./EnemiesContainer";
import { storeMocks } from "../../testHelpers";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("EnemiesContainer", () => {
  const contextValues = {
    state: {
      enemies: storeMocks.enemies,
      metamask: { account: "" },
    },
  };
  jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

  test("loading", () => {
    const stateValues = [true, jest.fn()];
    (useStateMock as jest.Mock).mockImplementation(() => stateValues);

    expect(shallow(<EnemiesContainer />)).toMatchSnapshot();
  });

  test("after loading loading", () => {
    const stateValues = [false, jest.fn()];
    (useStateMock as jest.Mock).mockImplementation(() => stateValues);

    expect(shallow(<EnemiesContainer />)).toMatchSnapshot();
  });
});
