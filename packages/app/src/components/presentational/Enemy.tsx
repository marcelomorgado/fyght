import React from "react";
import { Card } from "antd";
import { ChallengeModal } from "./ChallengeModal";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";
import { formatDai, formatPercent, formatWei } from "../../helpers";
import { BigNumber } from "ethers";

type Props = {
  enemy: Enemy;
};

// TODO: Move to .env
const BET_VALUE = `${5e18}`;
const ETHER = `${1e18}`;

export const Enemy: React.FC<Props> = ({
  enemy: {
    fyghter: { id, skin, name, xp, balance },
    winProbability,
  },
}: Props) => {
  const probability = winProbability ? winProbability.div(BigNumber.from("100")) : BigNumber.from("0");
  const pot = BigNumber.from(BET_VALUE)
    .mul(BigNumber.from("2"))
    .div(BigNumber.from(ETHER));

  const prize = pot.mul(probability);

  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>{`Balance: ${formatDai(balance)}`}</p>
      <p>{`Win probability: ${formatPercent(winProbability)}`}</p>

      <p>{`Gain if win: +${formatDai(prize)}`}</p>
      <p>{`Loss if lose: -${formatDai(prize)}`}</p>
      <ChallengeModal enemyId={id} />
    </Card>
  );
};
