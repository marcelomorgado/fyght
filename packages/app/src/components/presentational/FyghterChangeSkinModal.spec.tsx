import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../FyghtContext";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";

describe("FyghterChangeSkinModal", () => {
  test("should render the component", () => {
    const contextValues = { changeMyFyghterSkin: () => {} };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(shallow(<FyghterChangeSkinModal />)).toMatchSnapshot();
  });
});
