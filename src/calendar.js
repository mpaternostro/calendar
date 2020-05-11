import Weekly from './calendar/weekly/Weekly.js';
import CalendarEvent from './calendarEvent/CalendarEvent.js';
import { autoScroll } from './calendar/weekly/utilities.js';

export default async function start() {
  const endpoint = '../data/index.json';
  const data = await (await fetch(endpoint)).json();
  const events = data.map((event) => new CalendarEvent(event));
  const date = events[0].start;
  const weekly = new Weekly('Test', events, true, date);

  weekly.showTopBar();
  weekly.showCalendar();
  weekly.showEvents();
  autoScroll();
}
