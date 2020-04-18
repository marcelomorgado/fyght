import React from "react";
import { Spin, Button, Typography } from "antd";
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
      <Text code style={{ color: "#fff" }}>
        {`Dai Balance ${formatDai(balanceInWei)}`}
        {loading ? (
          <>
            {` `}
            <Spin size="small" />
          </>
        ) : null}
      </Text>

      <Button type="primary" onClick={mintDai}>
        {`Mint ${formatDai(MINT_AMOUNT)}`}
      </Button>
    </>
  );
};
