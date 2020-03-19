import React from "react";
import { Card } from "antd";
import { ChallengeModal } from "./ChallengeModal";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";
import { formatDai, formatPercent } from "../../helpers";

type Props = {
  enemy: Enemy;
};

export const Enemy: React.FC<Props> = ({
  enemy: {
    fyghter: { id, skin, name, xp, balance },
    winProbability,
  },
}: Props) => {
  return (
    <Card type="inner" title={name} hoverable={true} style={{ height: 405 }}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>{`Balance: ${formatDai(balance)}`}</p>
      <p>{`Win probability: ${formatPercent(winProbability)}`}</p>
      <ChallengeModal enemyId={id} />
    </Card>
  );
};
