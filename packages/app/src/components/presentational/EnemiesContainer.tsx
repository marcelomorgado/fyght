import React from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Enemy } from "./Enemy";
import { FyghtConsumer } from "../../FyghtContext";

const { Title } = Typography;

export const EnemiesContainer = () => {
  return (
    <FyghtConsumer>
      {fyghtContext =>
        fyghtContext && (
          <>
            <Row type="flex" justify="center">
              <Title level={2}>Challenge another player!</Title>
            </Row>
            <Row gutter={16} type="flex" justify="center">
              <Col span={3}>
                {fyghtContext.enemies.map((enemy, i) => (
                  <Enemy key={i} enemy={enemy} />
                ))}
              </Col>
            </Row>
          </>
        )
      }
    </FyghtConsumer>
  );
};
