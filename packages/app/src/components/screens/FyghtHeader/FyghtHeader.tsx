import React from "react";
import { Layout, Row, Col, Button, Typography } from "antd";
import { useFyghtState } from "../../../state";
import { BigNumber } from "ethers";
import { formatDai } from "../../../helpers";

const { Header } = Layout;
const { Text } = Typography;

type Props = {
  balanceInWei: BigNumber;
};

export const FyghtHeader: React.FC<Props> = ({ balanceInWei }: Props) => {
  const [
    {
      metamask: { ethereum, account },
      balance: { loading },
    },
    { setMetamaskAccount, setErrorMessage, mintDai },
  ] = useFyghtState();

  const onConnect = async (): Promise<void> => {
    if (!ethereum || !ethereum.isMetaMask) {
      setErrorMessage("You have to install Metamask to proceed");
      return;
    }
    const [account] = await ethereum.enable();
    setMetamaskAccount(account);
  };

  return (
    <Header>
      <Row justify={"end"}>
        <Col span={2}>
          <Text code style={{ color: "#fff" }}>
            {`Your Balance ${formatDai(balanceInWei)}`}
          </Text>
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={mintDai} loading={loading}>
            Get Dai
          </Button>
        </Col>
        <Col span={2} offset={18}>
          {!account ? (
            <Button type="primary" onClick={onConnect}>
              Sign in
            </Button>
          ) : null}
        </Col>
      </Row>
    </Header>
  );
};

export default FyghtHeader;
