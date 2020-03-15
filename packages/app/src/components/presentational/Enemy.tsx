import React from "react";
import { Card } from "antd";
import { AttackModal } from "./AttackModal";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";

type Props = {
  enemy: Fyghter;
};

export const Enemy: React.FC<Props> = ({ enemy: { id, skin, name, xp } }: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true} style={{ height: 405 }}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <AttackModal enemyId={id} />
    </Card>
  );
};
