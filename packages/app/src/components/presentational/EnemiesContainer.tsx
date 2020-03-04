import React from "react";
import { Row, Col, Divider } from "antd";
import { Enemy } from "./Enemy";
import { useFyghtContext } from "../../FyghtContext";

export const EnemiesContainer = () => {
  const { state } = useFyghtContext();
  return (
    <>
      <Divider
        orientation="left"
        style={{ color: "#333", fontWeight: "normal" }}
      >
        Enemies
      </Divider>
      <Row gutter={[16, 24]}>
        {state.enemies.map((enemy: Fyghter, i: number) => (
          <Col key={i} className="gutter-row" span={4}>
            <Enemy enemy={enemy} />
          </Col>
        ))}
      </Row>
    </>
  );
};
