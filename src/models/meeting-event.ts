export interface MeetingEvent {
  id: string;
  title: string;
  description: string;
  start: Date | string;
  end: Date | string;
  owner: string;
}