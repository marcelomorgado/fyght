import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../context";
import { ChallengeModal } from "./ChallengeModal";
import { BigNumber } from "ethers";
import { storeMocks } from "../../testHelpers";

const { myFyghter } = storeMocks;

describe("ChallengeModal", () => {
  test("should render the component", () => {
    const contextValues = { challengeAnEnemy: jest.fn(), state: { myFyghter } };

    jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

    expect(shallow(<ChallengeModal enemyId={BigNumber.from(2)} disabled={false} />)).toMatchSnapshot();
  });
});
