import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { EnemiesContainer } from "./EnemiesContainer";
import { storeMocks } from "../../testHelpers";

describe("EnemiesContainer", () => {
  test("should render the component", () => {
    const contextValues = {
      state: { enemies: storeMocks.enemies, initialized: true },
    };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(shallow(<EnemiesContainer />)).toMatchSnapshot();
  });
});
