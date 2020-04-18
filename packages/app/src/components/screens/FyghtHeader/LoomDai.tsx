import React from "react";
import { Space, Button, Typography, Spin } from "antd";
import { useFyghtState } from "../../../state";
import { formatDai } from "../../../helpers";
import { DEPOSIT_TO_LOOM_AMOUNT } from "../../../constants";

const { Text } = Typography;

export const LoomDai: React.FC = () => {
  const [
    {
      daiBalances: {
        loomBalance: { loading, amount: balanceInWei },
      },
    },
    { depositToLoom, withdrawFromLoom },
  ] = useFyghtState();

  return (
    <Space>
      <Text code style={{ color: "#fff" }}>
        {`FyGHT Balance ${formatDai(balanceInWei)}`}
        {loading ? (
          <>
            {` `}
            <Spin size="small" />
          </>
        ) : null}
      </Text>

      <Button type="primary" onClick={depositToLoom}>
        {`Deposit ${formatDai(DEPOSIT_TO_LOOM_AMOUNT)}`}
      </Button>

      <Button type="primary" onClick={withdrawFromLoom}>
        Withdraw All
      </Button>
    </Space>
  );
};
