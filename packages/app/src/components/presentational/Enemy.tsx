import React from "react";
import { Card } from "antd";
import { AttackModal } from "./AttackModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  enemy: Fyghter;
};

export const Enemy = ({ enemy: { id, skin, name, xp } }: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true} style={{ height: 405 }}>
      <SkinAvatar skin={skin} size="medium" />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <AttackModal enemyId={id} />
    </Card>
  );
};
