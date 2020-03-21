import React from "react";
import { Card } from "antd";
import { FyghterRenamingModal } from "./FyghterRenamingModal";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";
import { MyFyghterBalance } from "./MyFyghterBalance";

type Props = {
  fyghter: Fyghter;
};

export const MyFyghter: React.FC<Props> = ({ fyghter: { skin, name, xp, balance } }: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>
        {`Balance: `}
        <MyFyghterBalance value={balance} />
      </p>
      <FyghterRenamingModal />
      <p></p>
      <FyghterChangeSkinModal />
    </Card>
  );
};
