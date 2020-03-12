import * as React from "react";
import { shallow } from "enzyme";

import { SkinAvatar } from "./SkinAvatar";

describe("SkinAvatar", () => {
  test("should render the component", () => {
    expect(shallow(<SkinAvatar size="small" skin=Skin.NINJA />)).toMatchSnapshot();
  });
});
