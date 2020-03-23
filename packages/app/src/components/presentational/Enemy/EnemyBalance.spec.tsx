import * as React from "react";
import { shallow } from "enzyme";
import { EnemyBalance } from "./EnemyBalance";
import { ONE } from "../../../constants";

describe("EnemyBalance", () => {
  test("should render the component", () => {
    expect(shallow(<EnemyBalance value={ONE} gainIfWin={ONE} />)).toMatchSnapshot();
  });
});
