import React from "react";
import { Row, Col } from "antd";
import { MyFyghter } from "./MyFyghter";
import About from "./About";

export const MyFyghterContainer = () => {
  return (
    <Row gutter={16}>
      <Col span={3}>
        <MyFyghter
          fyghter={{
            id: 1,
            name: "Marcelo",
            skin: "naked",
            xp: 1,
            winCount: 3,
            lossCount: 4,
          }}
        />
      </Col>
      <Col span={21}>
        <About />
      </Col>  
    </Row>
  );
};
