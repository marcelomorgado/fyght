import React, { useEffect } from "react";
import { Layout, Row, Col, Alert, Spin } from "antd";
import { MyFyghterContainer } from "../../presentational/MyFyghterContainer";
import { EnemiesContainer } from "../../presentational/EnemiesContainer";
import { FyghtHeader } from "./FyghtHeader";
import { useFyghtState } from "../../../state";

const { Content, Footer } = Layout;

export const FyghtScreen: React.FC = () => {
  const [
    {
      messages: { errorMessage, infoMessage },
      metamask: { account, networkId, loading },
    },
    { initializeMetamask },
  ] = useFyghtState();

  useEffect(() => {
    initializeMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, networkId]);

  if (loading) {
    return <Spin />;
  }

  // TODO: Extract supported network to .env file
  if (networkId != 1337) {
    return <Alert message={`Please, connect to the local network (http://localhost:8545)`} type="error" showIcon />;
  }

  // TODO: Add visutal effect when updating messages
  return (
    <Layout className="layout">
      <FyghtHeader />
      <Content style={{ padding: "0 50px", margin: "16px 0" }}>
        <div className="site-layout-content">
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
          </div>
        </div>
      </Content>
      {/* TODO: Include github link and roadmap */}
      <Footer style={{ textAlign: "center" }}>fyght - A karate crypto game</Footer>
    </Layout>
  );
};

export default FyghtScreen;
