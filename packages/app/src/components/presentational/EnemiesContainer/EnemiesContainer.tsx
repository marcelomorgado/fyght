import React, { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import { Enemy } from "../Enemy";
import { useFyghtState } from "../../../state";

export const EnemiesContainer: React.FC = () => {
  const [isLoading, setLoading] = useState(true);

  const [
    {
      myFyghter,
      enemies,
      metamask: { ethereumAccount, networkId },
    },
    { fetchAllEnemies },
  ] = useFyghtState();

  useEffect(() => {
    const init = async (): Promise<void> => {
      await fetchAllEnemies();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumAccount, networkId, myFyghter]);

  if (isLoading) {
    return <>{`Loading ...`}</>;
  }

  if (enemies.length === 0) {
    return <>{`No enemies yet!`}</>;
  }

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        Enemies
      </Divider>
      <Row gutter={[16, 24]}>
        {enemies.map((enemy: Enemy, i: number) => (
          <Col key={i} className="gutter-row" span={4}>
            <Enemy enemy={enemy} myFyghter={myFyghter} />
          </Col>
        ))}
      </Row>
    </>
  );
};
