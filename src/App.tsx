import React from "react";
import { Layout, Menu } from "antd";
import { AuthProvider } from "./auth/auth-provider";
import logo from "./assets/logo.png";
import "./App.css";

const { Header, Content } = Layout;

const App = () => (
  <AuthProvider>
    <Layout>
      <Header>
        <div className="logo">
          <a href="/">
            <img src={logo} alt="logo" height="28px" width="auto" />
          </a>
        </div>
        <Menu theme="dark" mode="horizontal" style={{ float: "right" }} defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">Rejestracja</Menu.Item>
          <Menu.Item key="2">Logowanie</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">Content</div>
      </Content>
    </Layout>
  </AuthProvider>
);

export default App;
