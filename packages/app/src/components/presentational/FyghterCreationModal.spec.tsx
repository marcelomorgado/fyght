import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../context";
import { FyghterCreationModal } from "./FyghterCreationModal";

describe("FyghterCreationModal", () => {
  test("should render the component", () => {
    const contextValues = {
      createFyghter: jest.fn(),
    };

    jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

    expect(shallow(<FyghterCreationModal />)).toMatchSnapshot();
  });
});
