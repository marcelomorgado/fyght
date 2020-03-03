import React from "react";
import { Card } from "antd";
import { AttackModal } from "./AttackModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  enemy: Fyghter;
};

// TODO: Edit fyghter name
export const Enemy = ({
  enemy: { skin, name, xp, winCount, lossCount },
}: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size="medium" />
      <p></p>
      <p>{`wins: ${winCount} / losses: ${lossCount}`}</p>
      <p>{`XP: ${xp}`}</p>
      <AttackModal />
    </Card>
  );
};
