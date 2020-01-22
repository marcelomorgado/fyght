import React from "react";
import { Card, Icon } from "antd";
// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import images from "../../assets/img/*.png";

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

// TODO: Edit fyghter name
export const MyFyghter = ({
  fygher: { skin, name, xp, qi, winCount, lossCount },
}: Props) => {
  return (
    <Card
      type="inner"
      cover={<img alt="example" src={images[skin]} />}
      title=""
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
