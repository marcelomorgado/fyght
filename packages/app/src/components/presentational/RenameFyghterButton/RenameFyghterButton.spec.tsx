import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { RenameFyghterButton } from ".";
import { storeMocks } from "../../../testHelpers";

const { myFyghter } = storeMocks;

describe("RenameFyghterButton", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }, { renameMyFyghter: jest.fn() }]);

    expect(shallow(<RenameFyghterButton isLoading={false} />)).toMatchSnapshot();
  });
});
