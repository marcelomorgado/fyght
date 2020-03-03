import React from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Enemy } from "./Enemy";
import { useFyghtContext } from "../../FyghtContext";

const { Title } = Typography;

export const EnemiesContainer = () => {
  const { state } = useFyghtContext();
  return (
    <>
      <Row justify="center">
        <Title level={2}>Challenge another player!</Title>
      </Row>
      <Row gutter={16} justify="center">
        <Col span={3}>
          {state.enemies.map((enemy: Fyghter, i: number) => (
            <Enemy key={i} enemy={enemy} />
          ))}
        </Col>
      </Row>
    </>
  );
};
