import React from "react";
import { Spin } from "antd";
import { formatDai } from "../../../helpers";

interface Props {
  balance: BalanceState;
}

export const MyFyghterBalance: React.FC<Props> = ({ balance: { amount, loading } }: Props) => {
  return (
    <>
      <span style={{ color: "blue" }}>{`${formatDai(amount)}`}</span>{" "}
      {loading ? (
        <>
          {" "}
          <Spin size="small" />
        </>
      ) : null}
    </>
  );
};
