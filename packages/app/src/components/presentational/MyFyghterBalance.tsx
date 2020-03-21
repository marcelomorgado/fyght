import React from "react";
import { formatDai } from "../../helpers";
import { BigNumber } from "ethers";

interface Props {
  value: BigNumber;
}

export const MyFyghterBalance: React.FC<Props> = ({ value }: Props) => {
  return <span style={{ color: "blue" }}>{`${formatDai(value)}`}</span>;
};
