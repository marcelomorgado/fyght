import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { FyghtHeader } from "./FyghtHeader";

describe("FyghtHeader", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          metamask: { ethereumAccount: "0x", ethereum: { isMetaMask: true } },
        },
        { setMetamaskAccount: jest.fn(), setErrorMessage: jest.fn() },
      ]);

    expect(shallow(<FyghtHeader />)).toMatchSnapshot();
  });
});
