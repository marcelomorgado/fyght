import React from "react";
import { Card } from "antd";
import { FyghterRenamingModal } from "./FyghterRenamingModal";
import { FyghterChangeSkinModal } from "./FyghterChangeSkinModal";
import { SkinAvatar } from "./SkinAvatar";

type Props = {
  fyghter: Fyghter;
};

// TODO: Edit fyghter name
export const MyFyghter = ({
  fyghter: { skin, name, xp, winCount, lossCount },
}: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size="medium" />
      <p></p>
      <p>{`wins: ${winCount} / losses: ${lossCount}`}</p>
      <p>{`XP: ${xp}`}</p>
      <FyghterRenamingModal />
      <p></p>
      <FyghterChangeSkinModal />
    </Card>
  );
};