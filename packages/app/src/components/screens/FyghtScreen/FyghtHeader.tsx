import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { useFyghtState } from "../../../state";

const { Header } = Layout;

export const FyghtHeader: React.FC = () => {
  const [
    {
      metamask: { ethereum, account },
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
        <Col>
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