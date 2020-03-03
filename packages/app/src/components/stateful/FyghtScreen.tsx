import React from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import { MyFyghterContainer } from "../presentational/MyFyghterContainer";
import { EnemiesContainer } from "../presentational/EnemiesContainer";
import { JourneyTable } from "../presentational/JourneyTable";
import { FyghtProvider } from "../../FyghtContext";

const { Header, Content, Footer } = Layout;

export const FyghtScreen = () => {
  return (
    <FyghtProvider>
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
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
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <div style={{ margin: "16px 0" }}></div>
          <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
            <MyFyghterContainer />
            <EnemiesContainer />
            <JourneyTable />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>fyght - a crypto game</Footer>
      </Layout>
    </FyghtProvider>
  );
};

export default FyghtScreen;
