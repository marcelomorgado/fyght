import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { AttackModal } from "./AttackModal";
import { BigNumber } from "ethers/utils";

describe("AttackModal", () => {
  test("should render the component", () => {
    const contextValues = { attackAnEnemy: jest.fn() };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(
      shallow(<AttackModal enemyId={new BigNumber(2)} />)
    ).toMatchSnapshot();
  });
});
