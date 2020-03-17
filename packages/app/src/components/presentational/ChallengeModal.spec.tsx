import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { ChallengeModal } from "./ChallengeModal";
import { BigNumber } from "ethers";

describe("ChallengeModal", () => {
  test("should render the component", () => {
    const contextValues = { challengeAnEnemy: jest.fn() };

    jest.spyOn(FyghterContext, "useFyghtContext").mockImplementation(() => contextValues);

    expect(shallow(<ChallengeModal enemyId={BigNumber.from(2)} />)).toMatchSnapshot();
  });
});
