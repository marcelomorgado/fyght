import React from "react";
import { Row, Col, Table } from "antd";

import { skins } from "../../helpers";
import { SkinAvatar } from "./SkinAvatar";

const dataSource = skins.map((skin: any, i: number) => ({
  key: `${i + 1}`,
  ...skin,
}));

const columns = [
  {
    title: "",
    dataIndex: "skin",
    key: "skin",
    render: (text: string) => <SkinAvatar skin={text} size="small" />,
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
      <Row gutter={16} justify="center">
        <Col span={24}>
          <Table
            dataSource={dataSource}
            bordered={true}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
};
