import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { FyghterRenamingModal } from ".";
import { storeMocks } from "../../../testHelpers";

const { myFyghter } = storeMocks;

describe("FyghterRenamingModal", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }, { renameMyFyghter: jest.fn() }]);

    expect(shallow(<FyghterRenamingModal isLoading={false} />)).toMatchSnapshot();
  });
});
