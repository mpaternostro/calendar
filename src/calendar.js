import { autoScroll } from './utilities/utilities.js';
import { getCalendarEvents, getWeeklyCalendar } from './services/calendar.js';


export default async function start() {
  const events = await getCalendarEvents();
  const date = events[0].start;
  const weekly = getWeeklyCalendar(events, date);

  weekly.showTopBar();
  weekly.showCalendar();
  weekly.showEvents();
  autoScroll();
}
