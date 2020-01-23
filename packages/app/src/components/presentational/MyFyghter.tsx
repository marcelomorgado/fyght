import React from "react";
import { Card } from "antd";
import FyghterRenamingModal from "./FyghterRenamingModal";
import FyghterChangeSkinModal from "./FyghterChangeSkinModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  fyghter: {
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
  fyghter: { skin, name, xp, qi, winCount, lossCount },
}: Props) => {
  return (
    <Card
      type="inner"
      cover={<SkinAvatar skin={skin} size="medium" />}
      title={name}
    >
      <p></p>
      <p>{`wins: ${winCount} / losses: ${lossCount}`}</p>
      <p>{`XP: ${xp} / Qi: ${qi}`}</p>
      <FyghterRenamingModal />
      <p></p>
      <FyghterChangeSkinModal />
    </Card>
  );
};

export default MyFyghter;
