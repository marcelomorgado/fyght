import React from "react";
import { Row, Col, Alert } from "antd";
import { Typography } from "antd";

const { Title } = Typography;

export const EnemiesContainer = () => {
  return (
    <>
      <Row type="flex" justify="center">
        <Title level={2}>Challenge another player!</Title>
      </Row>
      <Row gutter={16} type="flex" justify="center">
        <Col span={16}>
          <Alert
            message="No enemies to fight yet. Invite your friends!"
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    </>
  );
};
