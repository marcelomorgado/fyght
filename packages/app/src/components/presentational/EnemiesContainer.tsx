import React, { useContext } from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Enemy } from "./Enemy";

import FyghtContext from "../../FyghtContext";

const { Title } = Typography;

export const useGlobalStore = () => useContext(FyghtContext);

export const EnemiesContainer = () => {
  const { state, dispatch } = useGlobalStore();
  return (
    <>
      <Row type="flex" justify="center">
        <Title level={2}>Challenge another player!</Title>
      </Row>
      <Row gutter={16} type="flex" justify="center">
        <Col span={3}>
          {state.enemies.map((enemy: Fyghter, i: number) => (
            <Enemy key={i} enemy={enemy} />
          ))}
        </Col>
      </Row>
    </>
  );
};
