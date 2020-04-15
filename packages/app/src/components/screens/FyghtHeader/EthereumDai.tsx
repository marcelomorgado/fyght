import React from "react";
import { Col, Button, Typography } from "antd";
import { useFyghtState } from "../../../state";
import { formatDai } from "../../../helpers";
import { MINT_AMOUNT } from "../../../constants";

const { Text } = Typography;

export const EthereumDai: React.FC = () => {
  const [
    {
      daiBalances: {
        ethereumBalance: { loading, amount: balanceInWei },
      },
    },
    { mintDai },
  ] = useFyghtState();

  return (
    <>
      <Col span={2}>
        <Text code style={{ color: "#fff" }}>
          {`Dai Balance ${formatDai(balanceInWei)}`}
        </Text>
      </Col>
      <Col span={2}>
        <Button type="primary" onClick={mintDai} loading={loading}>
          {/* TODO: Display MINT_AMOUNT here */}
          {`Mint $50`}
        </Button>
      </Col>
    </>
  );
};
