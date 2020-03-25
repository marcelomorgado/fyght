import * as React from "react";
import { shallow } from "enzyme";
import { RenameFyghterForm } from "./RenameFyghterForm";
import { storeMocks } from "../../../testHelpers";

describe("RenameFyghterForm", () => {
  test("should render the component", () => {
    const {
      myFyghter: { name },
    } = storeMocks;
    expect(
      shallow(<RenameFyghterForm visible={true} onCancel={jest.fn()} onSave={jest.fn()} name={name} />)
    ).toMatchSnapshot();
  });
});
