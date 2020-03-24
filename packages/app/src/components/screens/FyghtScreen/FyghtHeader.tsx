import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { useFyghtState } from "../../../state";

const { Header } = Layout;

export const FyghtHeader: React.FC = () => {
  const [
    {
      metamask: { ethereum, account },
    },
    { setMetamaskAccount },
  ] = useFyghtState();

  const onConnect = async (): Promise<void> => {
    const [account] = await ethereum.enable();
    setMetamaskAccount(account);
  };

  if (!ethereum || !ethereum.isMetaMask) {
    //return <>{"Please install MetaMask."}</>;
    console.log("Metmask not installed!");
  }

  return (
    <Header>
      <Row justify={"end"}>
        <Col>
          {!account ? (
            <Button type="primary" onClick={onConnect}>
              Connect to metamask
            </Button>
          ) : null}
        </Col>
      </Row>
    </Header>
  );
};

export default FyghtHeader;
