import React, { useState } from "react";
import { MeetingEvent } from "../models/meeting-event";
import { Modal, Form, Input, Button, DatePicker, message } from "antd";
import { Store } from "antd/lib/form/interface";
import { eventsUrl } from "../api/urls";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

interface EventFormModalProps {
  onSuccess: () => void;
  visible: boolean;
  readOnly?: boolean;
  event?: MeetingEvent | null;
  updateVisible: (status: boolean) => void;
  setReadOnly?: (status: boolean) => void;
}

const EventFormModal = (props: EventFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Nowe wydarzenie");
  const [form] = Form.useForm();
  const { visible, readOnly, event, updateVisible, setReadOnly } = props;
  const { RangePicker } = DatePicker;
  const { confirm } = Modal;

  React.useEffect(() => {
    if (readOnly && event) {
      setTitle(`${event?.title || "Wydarzenie"}`);
      form.setFieldsValue({
        title: event.title,
        description: event.description,
        rangePicker: [moment(event?.start), moment(event?.end)],
      });
    } else if (event?.id) {
      setTitle(`Edycja wydarzenia "${event.title}"`);
    } else {
      setTitle("Nowe wydarzenie");
    }
  }, [event, readOnly, form]);

  const updateStatus = (status: boolean) => {
    updateVisible(status);
  };

  const onFinish = (values: Store) => {
    setLoading(true);
    if (event?.id) {
      axios
        .put(`${eventsUrl}/${event.id}`, {
          title: values.title,
          description: values.description,
          start: values.rangePicker[0].toISOString(),
          end: values.rangePicker[1].toISOString(),
        })
        .then((res) => {
          console.log(res);
          message.success("Zaktualizowano wydarzenie.");
          onRequestSuccess();
        })
        .catch(() => {
          message.error("Coś poszło nie tak.");
          setLoading(false);
        });
    } else {
      axios
        .post(eventsUrl, {
          title: values.title,
          description: values.description,
          start: values.rangePicker[0].toISOString(),
          end: values.rangePicker[1].toISOString(),
        })
        .then((res) => {
          console.log(res);
          message.success("Dodano wydarzenie.");
          onRequestSuccess();
        })
        .catch(() => {
          message.error("Coś poszło nie tak.");
          setLoading(false);
        });
    }
  };

  const deleteEvent = () => {
    confirm({
      title: `Na pewno chcesz usunać to wydarzenie?`,
      icon: <ExclamationCircleOutlined />,
      content: `Wydarzenie "${event?.title}" zostanie usunięte po zaakceptowaniu.`,
      okText: "Tak",
      okType: "danger",
      cancelText: "Nie",
      onOk() {
        setLoading(true);
        return axios
          .delete(`${eventsUrl}/${event?.id}`)
          .then(() => {
            message.success("Wydarzenie zostało usunięte");
            onRequestSuccess();
          })
          .catch(() => {
            setLoading(false);
            message.error("Nie udało się usunąć wydarzenia");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onRequestSuccess = () => {
    setLoading(false);
    form.resetFields();
    updateStatus(false);
    props.onSuccess();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={() => updateStatus(false)}
      footer={null}
    >
      <Form
        form={form}
        name="eventForm"
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: "500px" }}
      >
        <Form.Item
          name="title"
          label="Nazwa"
          rules={[
            { required: true, message: "Proszę podać nazwę wydarzenia!" },
          ]}
        >
          <Input placeholder="Nazwa" disabled={readOnly} />
        </Form.Item>
        <Form.Item name="description" label="Opis">
          <Input.TextArea placeholder="Opis" disabled={readOnly} />
        </Form.Item>
        <Form.Item
          label="Data"
          name="rangePicker"
          rules={[{ required: true, message: "Proszę podać datę wydarzenia!" }]}
        >
          <RangePicker
            style={{ width: "100%" }}
            showTime={{ format: "HH:mm" }}
            format="DD-MM-YYYY HH:mm"
            disabled={readOnly}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
            disabled={readOnly}
          >
            Zatwierdź
          </Button>
          {setReadOnly && event?.id !== undefined && (
            <Form.Item>
              <Button
                disabled={loading}
                style={{ width: "100%", marginTop: "12px" }}
                onClick={() => setReadOnly(!readOnly)}
              >
                {readOnly ? "Edytuj" : "Anuluj edycje"}
              </Button>
              <Button
                type="primary"
                disabled={loading}
                style={{ width: "100%", marginTop: "12px" }}
                onClick={deleteEvent}
                danger
              >
                Usuń
              </Button>
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventFormModal;
