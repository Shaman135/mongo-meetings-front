import React from "react";
import { Link, Router, Route } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useAuth } from "./auth/auth-provider";
import { createBrowserHistory } from "history";
import logo from "./assets/logo2.png";
import "./App.css";
import Home from "./pages/Home";
import Particles from "react-particles-js";
import { AuthActionType } from "./models/auth-models";
import RegisterForm from "./components/RegisterForm";

const { Header, Content } = Layout;

const App = () => {
  const history = createBrowserHistory();
  const { state, dispatch } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);

  const onLoad = () => {
    document.title = "MongoMeetings"
    dispatch({ type: AuthActionType.INITIALIZE });
  };

  React.useEffect(() => {
    onLoad();
  }, []);

  return (
    <Router history={history}>
      <Particles
        params={{
          particles: {
            number: {
              value: 150,
            },
            size: {
              value: 3,
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "grab",
              },
            },
          },
        }}
        style={{
          position: "fixed",
          backgroundColor: "#577984",
        }}
      />
      <Layout>
        <Header style={{ zIndex: 100 }}>
          <Link to="#">
            <div className="logo">
              <img
                src={logo}
                alt="logo"
                height="42px"
                width="auto"
                style={{ marginTop: "-6px" }}
              />
            </div>
          </Link>
          <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
            {state.ready && state.isAuthenticated ? (
              <Menu.Item
                key="logout"
                onClick={() => dispatch({ type: AuthActionType.LOGOUT })}
              >
                Wyloguj, {`${state.user?.first_name} ${state.user?.last_name}`}
              </Menu.Item>
            ) : (
              <Menu.Item key="register" onClick={() => setModalVisible(!modalVisible)}>Rejestracja</Menu.Item>
            )}
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <RegisterForm visible={modalVisible} updateVisible={setModalVisible}/>
          <Route exact path="/" component={Home} />
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
