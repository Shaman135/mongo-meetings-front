import React from "react";
import { Store } from "antd/lib/form/interface";
import { authUrl } from "../api/urls";
import { message, Input, Button, Form, Modal } from "antd";
import axios from "axios";

interface RegisterFormProps {
  visible: boolean;
  updateVisible: (status: boolean) => void;
}

const RegisterForm = (props: RegisterFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  const updateStatus = (status: boolean) => {
    props.updateVisible(status);
  };

  const onFinish = (values: Store) => {
    setLoading(true);
    axios
      .post(`${authUrl}register`, {
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
      })
      .then((res: any) => {
        form.resetFields();
        updateStatus(false);
        setLoading(false);
        message.success("Sukces! Możesz się teraz zalogować :)");
      })
      .catch(() => {
        setLoading(false);
        message.error("Nie udało się zarejestrować");
      });
  };

  return (
    <Modal
      title="Rejestracja"
      visible={props.visible}
      onCancel={() => updateStatus(false)}
      footer={null}
    >
      <Form
        form={form}
        name="registerForm"
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
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "Proszę podać imię!" }]}
        >
          <Input placeholder="Imię" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Proszę podać nazwisko!" }]}
        >
          <Input placeholder="Nazwisko" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Proszę podać hasło!" },
            { min: 8, message: "Hasło musi mieć przynajmniej 8 znaków!" },
          ]}
        >
          <Input.Password placeholder="Hasło" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Proszę potwierdzić hasło.",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Podane hasła nie są takie same!");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Potwierdź hasło" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading}>
            Zatwierdź
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterForm;
