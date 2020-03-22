import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../state";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";
import { storeMocks } from "../../testHelpers";
const { myFyghter } = storeMocks;

describe("FyghterChangeSkinModal", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }, { changeMyFyghterSkin: jest.fn() }]);

    expect(shallow(<FyghterChangeSkinModal />)).toMatchSnapshot();
  });
});
