import * as React from "react";
import { shallow } from "enzyme";

import { MyFyghter } from "./MyFyghter";

describe("MyFyghter", () => {
  test("should render the component", () => {
    expect(
      shallow(
        <MyFyghter
          fyghter={{
            id: 1,
            name: "John",
            skin: "naked",
            xp: 2,
            winCount: 4,
            lossCount: 5,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
