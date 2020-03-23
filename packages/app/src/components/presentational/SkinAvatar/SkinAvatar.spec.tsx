import * as React from "react";
import { shallow } from "enzyme";
import { SkinAvatar } from ".";
import { AvatarSize, Skin } from "../../../constants";

describe("SkinAvatar", () => {
  test("should render the component", () => {
    expect(shallow(<SkinAvatar size={AvatarSize.SMALL} skin={Skin.NINJA} />)).toMatchSnapshot();
  });
});
