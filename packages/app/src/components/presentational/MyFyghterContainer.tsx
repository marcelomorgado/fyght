import React from "react";
import { Row, Col } from "antd";
import { MyFyghter } from "./MyFyghter";
import About from "./About";
import { useFyghtContext } from "../../FyghtContext";

export const MyFyghterContainer = () => {
  const {
    state: { myFyghter },
  } = useFyghtContext();

  return (
    <Row gutter={16}>
      <Col span={3}>
        <MyFyghter fyghter={myFyghter} />
      </Col>
      <Col span={21}>
        <About />
      </Col>
    </Row>
  );
};
