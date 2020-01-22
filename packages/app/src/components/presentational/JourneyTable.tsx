import React from "react";
import { Row, Col, Table } from "antd";
import { Typography } from "antd";
// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import images from "../../assets/img/*.png";

const getImageFromSkinName = (skinName: string) => (
  <img alt={skinName} src={images[skinName]} width={100} />
);

const { Title } = Typography;

const dataSource = [
  {
    key: "1",
    skin: "naked",
    level: "Naked",
    description:
      "You are ready to begin your journey when you let go all of material stuffs",
    unlock: "-",
  },
  {
    key: "2",
    skin: "normal_guy",
    level: "Normal Guy",
    description: "You are a new man now",
    unlock: "10 XP",
  },
  {
    key: "3",
    skin: "karate_kid",
    level: "Karate Kid",
    description: "Now people respect you",
    unlock: "15 XP",
  },
  {
    key: "4",
    skin: "japonese",
    level: "Japonese",
    description: "In the land of the rising sun new knowledges are discovered",
    unlock: "25 XP",
  },
  {
    key: "5",
    skin: "monk",
    level: "Monk",
    description: "Secret powers and wisdoms are achieve",
    unlock: "40 XP or 30 XP + 30 Qi",
  },
  {
    key: "6",
    skin: "ninja",
    level: "Ninja",
    description: "Secret powers and wisdoms are achieve",
    unlock: "50 XP",
  },
  {
    key: "7",
    skin: "no_one",
    level: "No One",
    description: "Valar dohaeris",
    unlock: "80 XP",
  },
  {
    key: "8",
    skin: "daemon",
    level: "Damon",
    description: "Anyone means anyone",
    unlock: "80 XP",
  },
  {
    key: "9",
    skin: "master",
    level: "Master",
    description: "Try not, do or do not",
    unlock: "100 XP + 100 Qi",
  },
];

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
          ;
        </Col>
      </Row>
    </>
  );
};

export default JourneyTable;