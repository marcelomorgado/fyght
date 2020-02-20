import * as React from "react";
import { shallow } from "enzyme";

import { Enemy } from "./Enemy";

describe("Enemy", () => {
  test("should render the component", () => {
    expect(
      shallow(
        <Enemy
          enemy={{
            id: 1,
            name: "Charlie",
            skin: "normal_guy",
            xp: 2,
            qi: 3,
            winCount: 4,
            lossCount: 5,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
