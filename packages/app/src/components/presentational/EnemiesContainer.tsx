import React from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Enemy } from "./Enemy";

const { Title } = Typography;

export const EnemiesContainer = () => {
  return (
    <>
      <Row type="flex" justify="center">
        <Title level={2}>Challenge another player!</Title>
      </Row>
      <Row gutter={16} type="flex" justify="center">
        <Col span={3}>
          {/*
          <Alert
            message="No enemies to fight yet. Invite your friends!"
            type="warning"
            showIcon
          />
           */}

          <Enemy
            enemy={{
              id: 2,
              name: "Charlie",
              // TODO: Skin as constant (?)
              skin: "normal_guy",
              xp: 1,
              qi: 2,
              winCount: 3,
              lossCount: 4,
            }}
          />
        </Col>
      </Row>
    </>
  );
};
