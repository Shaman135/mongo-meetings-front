import React from "react";
import { Form, Input, Button, message } from "antd";
import { Store } from "antd/lib/form/interface";
import { useAuth } from "../auth/auth-provider";
import { AuthActionType } from "../models/auth-models";
import { authUrl } from "../api/urls";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

interface LoginFormProps {
  onSucces?: () => void;
}

const LoginForm = (props: LoginFormProps) => {
  const { dispatch } = useAuth();

  const onFinish = (values: Store) => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: { loading: true } });
    axios
      .post(`${authUrl}login`, {
        email: values.email,
        password: values.password,
      })
      .then((res: any) => {
        dispatch({
          type: AuthActionType.LOGIN,
          payload: { token: res.data.token, user: res.data.user },
        });
        dispatch({
          type: AuthActionType.SET_LOADING,
          payload: { loading: false },
        });
        if (props.onSucces) {
          props.onSucces();
        }
      })
      .catch(() => {
        message.error("Nie udało się zalogować");
        dispatch({
          type: AuthActionType.SET_LOADING,
          payload: { loading: false },
        });
      });
  };

  return (
    <Form
      name="loginForm"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "500px" }}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Proszę podać email!" },
          {
            type: "email",
            message: "Podany adres nie jest prawidłowym adresem email!",
          },
        ]}
      >
        <Input placeholder="Email" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Proszę podać hasło!" }]}
        hasFeedback
      >
        <Input.Password placeholder="Hasło" prefix={<LockOutlined />} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Zatwierdź
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
