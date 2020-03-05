import React from "react";
import { Card } from "antd";
import { FyghterRenamingModal } from "./FyghterRenamingModal";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  fyghter: Fyghter;
};

// TODO: Edit fyghter name
export const MyFyghter = ({ fyghter: { skin, name, xp } }: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size="medium" />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <FyghterRenamingModal />
      <p></p>
      <FyghterChangeSkinModal />
    </Card>
  );
};
