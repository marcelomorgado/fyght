import * as React from "react";
import { shallow } from "enzyme";
import { WithdrawAllButton } from "./WithdrawAllButton";
import * as FyghtState from "../../state";
import { storeMocks } from "../../testHelpers";

describe("WithdrawAllButton", () => {
  const {
    myFyghter: { id: fyghterId },
  } = storeMocks;

  jest
    .spyOn(FyghtState, "useFyghtState")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockImplementation((): any => [{}, { withdrawAll: jest.fn() }]);

  test("should render the component", () => {
    expect(shallow(<WithdrawAllButton fyghterId={fyghterId} isLoading={false} />)).toMatchSnapshot();
  });
});
