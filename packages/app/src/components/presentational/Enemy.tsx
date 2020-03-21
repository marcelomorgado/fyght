import React from "react";
import { Card, Alert } from "antd";
import { ChallengeModal } from "./ChallengeModal";
import { SkinAvatar } from "./SkinAvatar";
import { AvatarSize } from "../../constants";
import { formatDai, formatPercent } from "../../helpers";
import { BigNumber } from "ethers";
import { FyghterBalance } from "./FyghterBalance";

type Props = {
  myFyghter: Fyghter;
  enemy: Enemy;
};

// TODO: Move to .env
const BET_VALUE = `${5e18}`;
const ETHER = `${1e18}`;

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
  const probability = winProbability ? winProbability : BigNumber.from("0");
  const pot = BigNumber.from(BET_VALUE).mul(BigNumber.from("2"));
  const prize = pot.mul(probability).div(BigNumber.from(ETHER));
  const ifWin = pot.sub(prize);
  const ifLose = prize.mul(BigNumber.from(-1));

  const enoughBalance = balance.gte(BigNumber.from(BET_VALUE));

  let warningMessage = null;
  if (!myFyghter) {
    warningMessage = "You have to create your fyghter to be able to do challenges.";
  } else if (!myFyghter.balance.gte(BigNumber.from(BET_VALUE))) {
    warningMessage = "Your fyghter with insufficient funds.";
  } else if (!enoughBalance) {
    warningMessage = "Enemy with insufficient funds.";
  }

  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>
        {`Balance: `}
        <FyghterBalance value={balance} />
      </p>

      {!myFyghter ? (
        <></>
      ) : (
        <>
          <p>
            {`Win probability: `}
            <WinProbability value={probability} />
          </p>
          <p>
            {`Gain if win: `}
            <GainOrLoss value={ifWin} />
          </p>
          <p>
            {`Loss if lose: `}
            <GainOrLoss value={ifLose} />
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
