import * as React from "react";
import { shallow } from "enzyme";
import * as FyghtState from "../../../state";
import { CreateFyghterButton } from ".";

describe("CreateFyghterButton", () => {
  test("should render the component", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(FyghtState, "useFyghtState").mockImplementation((): any => [{}, { createFyghter: jest.fn() }]);

    expect(shallow(<CreateFyghterButton disabled={false} />)).toMatchSnapshot();
  });
});
