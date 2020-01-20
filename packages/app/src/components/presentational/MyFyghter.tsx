import React from "react";
import { Card, Icon } from "antd";
// TODO: Import image dynamically
// TODO: Edit fyghter name
import skinImage from "../../assets/img/naked.png";

const { Meta } = Card;

type Props = {
  fygher: {
    id: number;
    skin: string;
    name: string;
    xp: number;
    qi: number;
    winCount: number;
    lossCount: number;
  };
};

export const MyFyghter = ({
  fygher: { skin, name, xp, qi, winCount, lossCount },
}: Props) => {
  return (
    <Card
      hoverable
      type="inner"
      style={{ width: 240 }}
      cover={<img alt="example" src={skinImage} />}
      title="Inner Card title"
      extra={<Icon type="edit" />}
    >
      <Meta
        title={name}
        description={`wins: ${winCount} / losses: ${lossCount}`}
      />
      <p></p>
      <p>{`XP: ${xp} / Qi: ${qi}`}</p>
    </Card>
  );
};

export default MyFyghter;
