import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../context";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";
import { storeMocks } from "../../testHelpers";
const { myFyghter } = storeMocks;

describe("FyghterChangeSkinModal", () => {
  test("should render the component", () => {
    const contextValues = {
      changeMyFyghterSkin: jest.fn(),
      state: { myFyghter },
    };

    jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

    expect(shallow(<FyghterChangeSkinModal />)).toMatchSnapshot();
  });
});
