import React from "react";
import { Row, Col, Divider } from "antd";
import { MyFyghter } from "./MyFyghter";
import { useFyghtContext } from "../../FyghtContext";

export const MyFyghterContainer = () => {
  const {
    state: { myFyghter },
  } = useFyghtContext();

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
