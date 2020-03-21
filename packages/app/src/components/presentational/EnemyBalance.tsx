import React from "react";
import { formatDai } from "../../helpers";
import { BigNumber } from "ethers";

interface Props {
  value: BigNumber;
  gainIfWin: BigNumber;
}

export const EnemyBalance: React.FC<Props> = ({ value, gainIfWin }: Props) => {
  const color = value.lt(gainIfWin) ? "red" : "blue";
  return <span style={{ color }}>{`${formatDai(value)}`}</span>;
};
