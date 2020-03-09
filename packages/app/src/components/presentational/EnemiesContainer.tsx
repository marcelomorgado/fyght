import React, { useEffect } from "react";
import { Row, Col, Divider } from "antd";
import { Enemy } from "./Enemy";
import { useFyghtContext } from "../../store";

export const EnemiesContainer = () => {
  // TODO: Set initialized as local state
  const {
    state: { initialized, enemies },
    loadEnemies,
  } = useFyghtContext();

  useEffect(() => {
    loadEnemies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialized) {
    return <>{`Loading...`}</>;
  }

  return (
    <>
      <Divider
        orientation="left"
        style={{ color: "#333", fontWeight: "normal" }}
      >
        Enemies
      </Divider>
      <Row gutter={[16, 24]}>
        {enemies.map((enemy: Fyghter, i: number) => (
          <Col key={i} className="gutter-row" span={4}>
            <Enemy enemy={enemy} />
          </Col>
        ))}
      </Row>
    </>
  );
};
