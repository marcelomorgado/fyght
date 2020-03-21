import React from "react";
import { formatDai } from "../../helpers";
import { BigNumber } from "ethers";

// TODO: Move to .env
const BET_VALUE = `${5e18}`;

export const FyghterBalance: React.FC<{ value: BigNumber }> = ({ value }: { value: BigNumber }) => {
  const color = value.lt(BigNumber.from(BET_VALUE)) ? "red" : "blue";
  return <span style={{ color }}>{`${formatDai(value)}`}</span>;
};
