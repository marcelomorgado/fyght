import React, { useEffect } from "react";
import { Layout, Row, Col, Button, Alert, Spin } from "antd";
import "antd/dist/antd.css";
import { MyFyghterContainer } from "../presentational/MyFyghterContainer";
import { EnemiesContainer } from "../presentational/EnemiesContainer";

import { useFyghtState } from "../../state";

const { Content, Footer } = Layout;

export const FyghtScreen: React.FC = () => {
  // TODO: Typed state object
  const [
    {
      messages: { errorMessage, infoMessage },
      metamask: { ethereum, account, networkId, loading },
    },
    { setMetamaskAccount, initializeMetamask },
  ] = useFyghtState();

  useEffect(() => {
    initializeMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (!ethereum || !ethereum.isMetaMask) {
    return <>{"Please install MetaMask."}</>;
  }

  const onConnect = async (): Promise<void> => {
    const [account] = await ethereum.enable();
    setMetamaskAccount(account);
  };

  if (!account) {
    return (
      <Button type="primary" block={true} onClick={onConnect}>
        Connect to metamask
      </Button>
    );
  }

  if (networkId != 1234) {
    return <>{`Please, connect to the local network (http://localhost:8545)`}</>;
  }

  // TODO: Add effect when updating messages
  return (
    <Layout>
      {/* <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">My fyghters</Menu.Item>
            <Menu.Item key="2">Fyght!</Menu.Item>
            <Menu.Item key="3">Buy/Sell fyghters</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}> */}
      <Content style={{ padding: "0 50px", marginTop: 25 }}>
        <div style={{ margin: "16px 0" }}></div>
        {errorMessage ? <Alert message={errorMessage} type="error" closable showIcon /> : null}
        {infoMessage ? <Alert message={infoMessage} type="info" closable showIcon /> : null}
        <div style={{ margin: "16px 0" }}></div>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <Row gutter={16}>
            <Col span={3}>
              <MyFyghterContainer />
            </Col>
            <Col span={21}>
              <EnemiesContainer />
            </Col>
          </Row>

          {/* <Row gutter={16} style={{ marginTop: 25 }}>
              <Col span={6}>
                <About />
              </Col>
              <Col span={18}>
                <JourneyTable />
              </Col>
            </Row> */}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>fyght - a crypto game</Footer>
    </Layout>
  );
};

export default FyghtScreen;
