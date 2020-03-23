import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { ChangeSkinButton } from ".";
import { storeMocks } from "../../../testHelpers";
const { myFyghter } = storeMocks;

describe("ChangeSkinButton", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }, { changeMyFyghterSkin: jest.fn() }]);

    expect(shallow(<ChangeSkinButton isLoading={false} />)).toMatchSnapshot();
  });
});