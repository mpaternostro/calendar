import getCalendarEventsData from '../api/calendar.js';
import CalendarEvent from '../entities/calendarEvent/CalendarEvent.js';
import Weekly from '../entities/calendar/weekly/Weekly.js';

export async function getCalendarEvents() {
  const eventsData = await getCalendarEventsData();
  const events = eventsData.map((event) => new CalendarEvent(event));
  return events;
}

export function getWeeklyCalendar(events, startDate) {
  return new Weekly('Test', events, true, startDate);
}
