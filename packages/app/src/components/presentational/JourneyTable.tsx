import React from "react";
import { Row, Col, Table } from "antd";
import { Typography } from "antd";
import { skins } from "../../helpers";
import { SkinAvatar } from "./SkinAvatar";

const getImageFromSkinName = (skinName: string) => (
  <SkinAvatar skin={skinName} size="small" />
);

const { Title } = Typography;

const dataSource = skins.map((skin: any, i: number) => ({
  key: `${i + 1}`,
  ...skin,
}));

const columns = [
  {
    title: "",
    dataIndex: "skin",
    key: "skin",
    render: (text: string) => getImageFromSkinName(text),
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Unlock",
    dataIndex: "unlock",
    key: "unlock",
  },
];

export const JourneyTable = () => {
  return (
    <>
      <Row type="flex" justify="center">
        <Title level={2}>Experience Journey</Title>
      </Row>
      <Row gutter={16} type="flex" justify="center">
        <Col span={16}>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Col>
      </Row>
    </>
  );
};

export default JourneyTable;
