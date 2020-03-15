import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { FyghterRenamingModal } from "./FyghterRenamingModal";

describe("FyghterRenamingModal", () => {
  test("should render the component", () => {
    const contextValues = { renameMyFyghter: jest.fn() };

    jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

    expect(shallow(<FyghterRenamingModal />)).toMatchSnapshot();
  });
});
