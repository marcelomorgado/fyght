import * as React from "react";
import { shallow } from "enzyme";
import { DepositButton } from "./DepositButton";
import * as FyghtState from "../../state";
import { storeMocks } from "../../testHelpers";

describe("DepositButton", () => {
  const {
    myFyghter: { id: fyghterId },
  } = storeMocks;

  jest
    .spyOn(FyghtState, "useFyghtState")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockImplementation((): any => [{}, { doDeposit: jest.fn() }]);

  test("should render the component", () => {
    expect(shallow(<DepositButton fyghterId={fyghterId} isLoading={false} />)).toMatchSnapshot();
  });
});
