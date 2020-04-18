import React from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { BigNumber } from "ethers/utils";

type Props = {
  fyghterId: BigNumber;
  isLoading: boolean;
};

export const DepositButton: React.FC<Props> = ({ fyghterId, isLoading }: Props) => {
  const [
    {
      metamask: {
        contracts: { fyghters },
      },
    },
    { doDeposit },
  ] = useFyghtState();

  const onClick = async (): Promise<void> => {
    const amount = await fyghters.getMinimumDeposit();
    doDeposit(fyghterId, amount);
  };

  return (
    <Button type="primary" block={true} onClick={onClick} loading={isLoading}>
      {/* TODO: Get from a global var (contract?) - typechain constant or set to the state at start */}
      Deposit $5.00
    </Button>
  );
};
