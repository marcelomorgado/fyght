import React from "react";
import { Card, Button } from "antd";
import FyghterRenamingModal from "./FyghterRenamingModal";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import images from "../../assets/img/*.png";

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
      cover={<img alt={skin} src={images[skin]} />}
      title={name}
    >
      <p></p>
      <p>{`wins: ${winCount} / losses: ${lossCount}`}</p>
      <p>{`XP: ${xp} / Qi: ${qi}`}</p>
      <FyghterRenamingModal />
      <p></p>
      <Button block={true} type="primary">
        Change skin
      </Button>
    </Card>
  );
};

export default MyFyghter;
