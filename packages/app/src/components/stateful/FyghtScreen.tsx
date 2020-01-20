// import React from "react";
import MyFyghter from "../presentational/MyFyghter";

// export const FyghtScreen = () => {
//   return (
//     <div>
//       <MyFyghter
//         fygher={{
//           id: 1,
//           name: "Marcelo",
//           skin: "naked",
//           xp: 1,
//           qi: 2,
//           winCount: 3,
//           lossCount: 4,
//         }}
//       />
//     </div>
//   );
// };

// export default FyghtScreen;
import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

export const FyghtScreen = () => {
  return (
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
          <MyFyghter
            fygher={{
              id: 1,
              name: "Marcelo",
              skin: "naked",
              xp: 1,
              qi: 2,
              winCount: 3,
              lossCount: 4,
            }}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>fyght - a crypto game</Footer>
    </Layout>
  );
};
export default FyghtScreen;
