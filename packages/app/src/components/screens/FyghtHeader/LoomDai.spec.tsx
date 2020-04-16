import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { LoomDai } from "./LoomDai";
import { BigNumber } from "ethers/utils";

describe("LoomDai", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [
        {
          daiBalances: {
            loomBalance: { amount: new BigNumber(10), loading: false },
          },
        },
        { depositToLoom: jest.fn(), withdrawFromLoom: jest.fn() },
      ]);

    expect(shallow(<LoomDai />)).toMatchSnapshot();
  });
});
