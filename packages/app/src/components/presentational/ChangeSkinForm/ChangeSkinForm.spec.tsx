import * as React from "react";
import { shallow } from "enzyme";
import { ChangeSkinForm } from "./ChangeSkinForm";
import * as FyghtState from "../../../state";
import { storeMocks } from "../../../testHelpers";
const { myFyghter } = storeMocks;

describe("ChangeSkinForm", () => {
  test("should render the component", () => {
    jest
      .spyOn(FyghtState, "useFyghtState")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((): any => [{ myFyghter }]);

    expect(
      shallow(<ChangeSkinForm visible={true} onSave={jest.fn()} onCancel={jest.fn()} errorMessage={""} />)
    ).toMatchSnapshot();
  });
});
