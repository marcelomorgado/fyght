import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { EthereumDai } from "./EthereumDai";
import { BigNumber } from "ethers/utils";

describe("EthereumDai", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          daiBalances: {
            ethereumBalance: { amount: new BigNumber(10), loading: false },
          },
        },
        { mintDai: jest.fn() },
      ]);

    expect(shallow(<EthereumDai />)).toMatchSnapshot();
  });
});
