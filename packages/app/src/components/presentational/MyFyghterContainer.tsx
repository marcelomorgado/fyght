import React, { useContext } from "react";
import { Row, Col } from "antd";
import { MyFyghter } from "./MyFyghter";
import About from "./About";
import FyghtContext from "../../FyghtContext";

export const MyFyghterContainer = () => {
  const { state, dispatch } = useContext(FyghtContext);
  return (
    <Row gutter={16}>
      <Col span={3}>
        <MyFyghter fyghter={state.myFyghter} />
      </Col>
      <Col span={21}>
        <About />
      </Col>
    </Row>
  );
};
