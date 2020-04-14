import React from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { MIN_DEPOSIT } from "../../../constants";
import { BigNumber } from "ethers/utils";

type Props = {
  fyghterId: BigNumber;
  isLoading: boolean;
};

export const DepositButton: React.FC<Props> = ({ fyghterId, isLoading }: Props) => {
  const [, { doDeposit }] = useFyghtState();

  const onClick = (): void => {
    doDeposit(fyghterId, new BigNumber(MIN_DEPOSIT));
  };

  return (
    <Button type="primary" block={true} onClick={onClick} loading={isLoading}>
      Deposit $5
    </Button>
  );
};
