import * as React from "react";
import { shallow } from "enzyme";
import { DepositButton } from "./DepositButton";
import * as FyghtState from "../../../state";
import { storeMocks } from "../../../testHelpers";
import { BigNumber } from "ethers/utils";

describe("DepositButton", () => {
  const {
    myFyghter: { id: fyghterId },
  } = storeMocks;

  jest
    .spyOn(FyghtState, "useFyghtState")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockImplementation((): any => [
      {
        metamask: {
          contracts: { fyghters: { getMinimumDeposit: jest.fn(() => new BigNumber("5")) } },
        },
      },
      { doDeposit: jest.fn() },
    ]);

  test("should render the component", () => {
    expect(shallow(<DepositButton fyghterId={fyghterId} isLoading={false} />)).toMatchSnapshot();
  });
});
