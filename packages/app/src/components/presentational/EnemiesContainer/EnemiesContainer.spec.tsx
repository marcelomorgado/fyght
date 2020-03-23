import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { EnemiesContainer } from ".";
import { storeMocks } from "../../../testHelpers";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("EnemiesContainer", () => {
  jest
    .spyOn(FyghtState, "useFyghtState")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockImplementation((): any => [{ enemies: storeMocks.enemies, metamask: { account: "" } }, {}]);

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
