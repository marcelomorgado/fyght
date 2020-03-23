import React from "react";
import { Card, Alert } from "antd";
import { ChallengeModal } from "../ChallengeModal";
import { SkinAvatar } from "../SkinAvatar";
import { AvatarSize } from "../../../constants";
import { formatDai, formatPercent, calculateGainAndLoss } from "../../../helpers";
import { BigNumber } from "ethers";
import { EnemyBalance } from "./EnemyBalance";

type Props = {
  myFyghter: Fyghter;
  enemy: Enemy;
};

const GainOrLoss: React.FC<{ value: BigNumber }> = ({ value }: { value: BigNumber }) => {
  const color = value.lt(BigNumber.from(0)) ? "red" : "blue";
  return <span style={{ color }}>{`${formatDai(value)}`}</span>;
};

const WinProbability: React.FC<{ value: BigNumber }> = ({ value }: { value: BigNumber }) => {
  const color = value.lt(BigNumber.from(`${5e17}`)) ? "red" : "blue";
  return <span style={{ color }}>{`${formatPercent(value)}`}</span>;
};

export const Enemy: React.FC<Props> = ({
  myFyghter,
  enemy: {
    fyghter: { id, skin, name, xp, balance },
    winProbability,
  },
}: Props) => {
  const { gainIfWin, lossIfLose } = calculateGainAndLoss(winProbability);

  const enemyHasEnoughBalance = balance.gte(gainIfWin);

  let warningMessage = null;
  if (!myFyghter) {
    warningMessage = "You have to create your fyghter to be able to do challenges.";
  } else if (!myFyghter.balance.gte(lossIfLose)) {
    warningMessage = "Your fyghter with insufficient funds.";
  } else if (!enemyHasEnoughBalance) {
    warningMessage = "Enemy with insufficient funds.";
  }

  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>
        {`Balance: `}
        <EnemyBalance value={balance} gainIfWin={gainIfWin} />
      </p>

      {!myFyghter ? (
        <></>
      ) : (
        <>
          <p>
            {`Win probability: `}
            <WinProbability value={winProbability || BigNumber.from("0")} />
          </p>
          <p>
            {`Gain if win: `}
            <GainOrLoss value={gainIfWin} />
          </p>
          <p>
            {`Loss if lose: `}
            <GainOrLoss value={lossIfLose} />
          </p>
        </>
      )}

      <ChallengeModal enemyId={id} disabled={!!warningMessage} />
      {warningMessage ? (
        <>
          <p></p>
          <Alert message={warningMessage} type="warning" />
        </>
      ) : (
        <></>
      )}
    </Card>
  );
};
