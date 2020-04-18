import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { MainScreen } from "./MainScreen";
import { BigNumber } from "ethers/utils";

describe("MainScreen", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          metamask: { account: "0x", ethereum: { isMetaMask: true }, networkId: 1234, loading: false },
          daiBalances: { ethereumBalanec: { amount: new BigNumber(10) } },
        },
        { setMetamaskAccount: jest.fn(), initializeMetamask: jest.fn() },
      ]);

    expect(shallow(<MainScreen />)).toMatchSnapshot();
  });
});
