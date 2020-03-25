import * as React from "react";
import { shallow } from "enzyme";
import { CreateFyghterForm } from "./CreateFyghterForm";

describe("CreateFyghterForm", () => {
  test("should render the component", () => {
    expect(shallow(<CreateFyghterForm visible={true} onCancel={jest.fn()} onCreate={jest.fn()} />)).toMatchSnapshot();
  });
});
