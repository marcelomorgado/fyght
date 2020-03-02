import React from "react";
import { Card } from "antd";
import { AttackModal } from "./AttackModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  enemy: {
    id: number;
    skin: string;
    name: string;
    xp: number;
    winCount: number;
    lossCount: number;
  };
};

// TODO: Edit fyghter name
export const Enemy = ({
  enemy: { skin, name, xp, winCount, lossCount },
}: Props) => {
  return (
    <Card
      type="inner"
      cover={<SkinAvatar skin={skin} size="medium" />}
      title={name}
    >
      <p></p>
      <p>{`wins: ${winCount} / losses: ${lossCount}`}</p>
      <p>{`XP: ${xp}`}</p>
      <AttackModal />
    </Card>
  );
};
