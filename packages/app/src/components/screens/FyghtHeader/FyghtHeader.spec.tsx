import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { FyghtHeader } from "./FyghtHeader";
import { BigNumber } from "ethers";

describe("FyghtScreen", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          metamask: { account: "0x", ethereum: { isMetaMask: true }, networkId: 1234, loading: false },
          balance: { loading: false },
        },
        { setMetamaskAccount: jest.fn(), setErrorMessage: jest.fn() },
      ]);

    const balanceInWei = BigNumber.from(10);
    expect(shallow(<FyghtHeader balanceInWei={balanceInWei} />)).toMatchSnapshot();
  });
});
