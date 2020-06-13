import React, { useState } from "react";
import { useAuth } from "../auth/auth-provider";
import { Card, Skeleton, Button, message, Spin } from "antd";
import LoginForm from "../components/LoginForm";
import EventCalendar from "../components/EventCalendar";
import EventFormModal from "../components/EventFormModal";
import axios from "axios";
import { eventsUrl } from "../api/urls";
import { MeetingEvent } from "../models/meeting-event";

const Home = () => {
  const { state } = useAuth();
  const [title, setTitle] = useState("Logowanie");
  const [events, setEvents] = useState(Array<MeetingEvent>());
  const [eventsLoading, setEventsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [event, setEvent] = useState<MeetingEvent | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  const selectEvent = (e: any) => {
    const selected = events.find((event) => event.id === e.event.id);
    if (selected !== undefined) {
      setEvent(selected);
      setReadOnly(true);
      setEditModalVisible(true);
    } else {
      setEvent(null);
    }
  };

  const updateEvent = (e: any) => {
    const toUpdate = events.findIndex((event) => event.id === e.event.id);
    if (toUpdate) {
      axios
        .put(`${eventsUrl}/${events[toUpdate].id}`, {
          ...events[toUpdate],
          start: e.event.start.toISOString(),
          end: e.event.end.toISOString(),
        })
        .then((res) => {
          const e = res.data;
          events[toUpdate] = {
            id: e._id.$oid,
            title: e.title,
            description: e.description,
            start: new Date(e.start.$date),
            end: new Date(e.end.$date),
            owner: e.owner.$oid,
          } as MeetingEvent;
          message.success("Zaktualizowano wydarzenie.");
        })
        .catch(() => {
          message.error("Coś poszło nie tak.");
          fetchEvents();
        });
    }
  };

  const fetchEvents = () => {
    setEventsLoading(true);
    axios
      .get(eventsUrl)
      .then((res) => {
        setEvents(
          res.data.map((e: any) => {
            return {
              id: e._id.$oid,
              title: e.title,
              description: e.description,
              start: new Date(e.start.$date),
              end: new Date(e.end.$date),
              owner: e.owner.$oid,
            } as MeetingEvent;
          })
        );
        setEventsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setEventsLoading(false);
        message.error("Nie udało się pobrać wydarzeń.");
      });
  };

  React.useEffect(() => {
    if (state.isAuthenticated) {
      setTitle(`Witaj ${state.user?.first_name}, oto twój kalndarz spotakań.`);
      fetchEvents();
    } else if (state.loading) {
      setTitle("Trwa inicjalizacja...");
    } else {
      setTitle("Logowanie");
    }
  }, [state]);

  const renderView = (): React.ReactElement => {
    if (state.loading) {
      return (
        <Card title={title} style={{ maxWidth: "500px", margin: "64px auto" }}>
          <Skeleton active />
        </Card>
      );
    } else if (state.isAuthenticated) {
      return (
        <>
          <Card
            title={title}
            style={{ margin: "64px" }}
            extra={
              <Button onClick={() => setModalVisible(!modalVisible)}>
                Dodaj wydarzenie
              </Button>
            }
          >
            {eventsLoading ? (
              <Skeleton active paragraph={{ rows: 20 }}/>
            ) : (
              <EventCalendar
                events={events}
                onEventClick={selectEvent}
                onEventDrop={updateEvent}
              />
            )}
          </Card>
          <EventFormModal
            visible={modalVisible}
            updateVisible={setModalVisible}
            onSuccess={fetchEvents}
            readOnly={false}
          />
          <EventFormModal
            visible={editModalVisible}
            updateVisible={setEditModalVisible}
            onSuccess={fetchEvents}
            event={event}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
          />
        </>
      );
    } else {
      return (
        <Card title={title} style={{ maxWidth: "500px", margin: "64px auto" }}>
          <LoginForm></LoginForm>
        </Card>
      );
    }
  };

  return <>{renderView()}</>;
};

export default Home;
