import * as React from "react";
import { shallow } from "enzyme";
import * as FyghterContext from "../../store";
import { AttackModal } from "./AttackModal";

describe("AttackModal", () => {
  test("should render the component", () => {
    const contextValues = { attackAnEnemy: () => {} };

    jest
      .spyOn(FyghterContext, "useFyghtContext")
      .mockImplementation(() => contextValues);

    expect(shallow(<AttackModal enemyId={2} />)).toMatchSnapshot();
  });
});
