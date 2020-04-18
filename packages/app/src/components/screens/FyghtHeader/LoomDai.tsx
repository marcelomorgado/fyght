import React from "react";
import { Col, Button, Typography } from "antd";
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
    <>
      <Col span={3}>
        <Text code style={{ color: "#fff" }}>
          {`FyGHT Balance ${formatDai(balanceInWei)}`}
        </Text>
      </Col>
      <Col span={2}>
        <Button type="primary" onClick={depositToLoom} loading={loading}>
          {`Deposit ${formatDai(DEPOSIT_TO_LOOM_AMOUNT)}`}
        </Button>
      </Col>
      <Col span={2}>
        <Button type="primary" onClick={withdrawFromLoom} loading={loading}>
          Withdraw All
        </Button>
      </Col>
    </>
  );
};
