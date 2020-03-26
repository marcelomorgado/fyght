import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { MainScreen } from "./MainScreen";
import { BigNumber } from "ethers";

describe("MainScreen", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          messages: { errorMessage: null, infoMessage: null },
          metamask: { account: "0x", ethereum: { isMetaMask: true }, networkId: 1234, loading: false },
          balance: { amount: BigNumber.from(10) },
        },
        { setMetamaskAccount: jest.fn(), initializeMetamask: jest.fn() },
      ]);

    expect(shallow(<MainScreen />)).toMatchSnapshot();
  });
});
