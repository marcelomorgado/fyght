import React from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { BigNumber } from "ethers/utils";

type Props = {
  fyghterId: BigNumber;
  isLoading: boolean;
};

export const WithdrawAllButton: React.FC<Props> = ({ fyghterId, isLoading }: Props) => {
  const [, { withdrawAll }] = useFyghtState();

  const onClick = (): void => {
    withdrawAll(fyghterId);
  };

  return (
    <Button type="primary" block={true} onClick={onClick} loading={isLoading}>
      Withdraw All
    </Button>
  );
};
