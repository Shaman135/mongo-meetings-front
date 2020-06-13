import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MeetingEvent } from "../models/meeting-event";

interface EventCalendarProps {
  events: MeetingEvent[];
  onEventClick: (e: any) => void;
  onEventDrop: (e: any) => void;
}

const EventCalendar = (props: EventCalendarProps) => {
  return (
    <FullCalendar
      editable={true}
      eventDrop={props.onEventDrop}
      events={props.events}
      slotDuration="00:30:00"
      locale="pl"
      weekends={true}
      allDaySlot={false}
      buttonText={{
        today: "Dziś",
        month: "Miesiąc",
        week: "Tydzień",
        day: "Dzień",
      }}
      droppable={true}
      header={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      }}
      eventClick={props.onEventClick}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    />
  );
};

export default EventCalendar;
