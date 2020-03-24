import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { FyghtHeader } from "./FyghtHeader";

describe("FyghtScreen", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          metamask: { account: "0x", ethereum: { isMetaMask: true }, networkId: 1234, loading: false },
        },
        { setMetamaskAccount: jest.fn(), setErrorMessage: jest.fn() },
      ]);

    expect(shallow(<FyghtHeader />)).toMatchSnapshot();
  });
});
