import React from "react";
import { Row, Col } from "antd";
import { MyFyghter } from "./MyFyghter";
import About from "./About";
import { FyghtConsumer } from "../../FyghtContext";

export const MyFyghterContainer = () => {
  return (
    <FyghtConsumer>
      {fyghtContext =>
        fyghtContext && (
          <Row gutter={16}>
            <Col span={3}>
              <MyFyghter fyghter={fyghtContext.myFyghter} />
            </Col>
            <Col span={21}>
              <About />
            </Col>
          </Row>
        )
      }
    </FyghtConsumer>
  );
};
