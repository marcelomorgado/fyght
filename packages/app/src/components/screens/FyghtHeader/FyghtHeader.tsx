import React from "react";
import { Layout, Space, Row, Col, Button } from "antd";
import { useFyghtState } from "../../../state";
import { EthereumDai } from "./EthereumDai";
import { LoomDai } from "./LoomDai";

const { Header } = Layout;

export const FyghtHeader: React.FC = () => {
  const [
    {
      metamask: { ethereum, ethereumAccount: account },
    },
    { setMetamaskAccount, setErrorMessage },
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
        <Col span={12}>
          <LoomDai />
        </Col>
        <Col span={6} offset={6}>
          <Space style={{ float: "right" }}>
            <EthereumDai />
            {!account ? (
              <Button type="primary" onClick={onConnect}>
                Sign in
              </Button>
            ) : null}
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default FyghtHeader;
