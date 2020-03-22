import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../state";
import { ChallengeModal } from "./ChallengeModal";
import { BigNumber } from "ethers";
import { storeMocks } from "../../testHelpers";

const { myFyghter } = storeMocks;

describe("ChallengeModal", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }, { challengeAnEnemy: jest.fn() }]);

    expect(shallow(<ChallengeModal enemyId={BigNumber.from(2)} disabled={false} />)).toMatchSnapshot();
  });
});
