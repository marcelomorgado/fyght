import React, { useEffect } from "react";
import { Row, Col, Divider } from "antd";
import { MyFyghter } from "./MyFyghter";
import { useFyghtContext } from "../../store";

export const MyFyghterContainer = () => {
  const {
    state: { myFyghter },
    loadMyFyghter,
  } = useFyghtContext();

  useEffect(() => {
    loadMyFyghter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (myFyghter === null) {
    return <>{`Loading...`}</>;
  }

  return (
    <>
      <Divider
        orientation="left"
        style={{ color: "#333", fontWeight: "normal" }}
      >
        My Fyghter
      </Divider>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <MyFyghter fyghter={myFyghter} />
        </Col>
      </Row>
    </>
  );
};
