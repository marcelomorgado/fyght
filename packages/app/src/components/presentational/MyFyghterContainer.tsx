import React from "react";
import { Row, Col } from "antd";
import MyFyghter from "./MyFyghter";
import About from "./About";
import Training from "./Training";

export const MyFighterContainer = () => {
  return (
    <Row gutter={16}>
      <Col span={3}>
        <MyFyghter
          fyghter={{
            id: 1,
            name: "Marcelo",
            skin: "naked",
            xp: 1,
            qi: 2,
            winCount: 3,
            lossCount: 4,
          }}
        />
      </Col>
      <Col span={18}>
        <About />
      </Col>
      <Col span={3}>
        <Training trainingCost={0.25} />
      </Col>
    </Row>
  );
};

export default MyFighterContainer;
