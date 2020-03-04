import React from "react";
import { Layout, Menu, Row, Col } from "antd";
import "antd/dist/antd.css";
import { MyFyghterContainer } from "../presentational/MyFyghterContainer";
import { EnemiesContainer } from "../presentational/EnemiesContainer";
import { JourneyTable } from "../presentational/JourneyTable";
import { FyghtProvider } from "../../FyghtContext";
import About from "../presentational/About";

const { Header, Content, Footer } = Layout;

export const FyghtScreen = () => {
  return (
    <FyghtProvider>
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
    </FyghtProvider>
  );
};

export default FyghtScreen;
