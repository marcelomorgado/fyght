import React from "react";
import { Row, Col, Table } from "antd";
import { skins } from "../../helpers";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";

const dataSource = skins.map((skin: {}, i: number) => ({
  key: `${i + 1}`,
  ...skin,
}));

const columns = [
  {
    title: "",
    dataIndex: "skin",
    key: "skin",
    render: (text: string): JSX.Element => <SkinAvatar skin={text} size={AvatarSize.SMALL} />,
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

export const JourneyTable: React.FC = () => {
  return (
    <>
      <Row gutter={16} justify="center">
        <Col span={24}>
          <Table dataSource={dataSource} bordered={true} columns={columns} pagination={false} />
        </Col>
      </Row>
    </>
  );
};
