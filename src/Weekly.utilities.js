import { addHours, eachDayOfInterval, add } from 'date-fns';
import { changeDate } from './utilities.js';
import CalendarEvent from './CalendarEvent.js';

export function getWeek(date) {
  return eachDayOfInterval({ start: date, end: add(date, { days: 6 }) });
}

export function handleDateSelector(btn, calendar) {
  const direction = btn.dataset.keyword;
  let day;
  if (['forward', 'backward'].includes(direction)) {
    day = changeDate(calendar.dates[0], direction);
  } else {
    day = new Date();
  }
  calendar.dates = getWeek(day);
  calendar.showTopBar();
  calendar.showCalendar();
  calendar.showEvents();
}

export function handleClick(e) {
  const $eventButton = e.target.closest('.event');
  // SI CLICKEAS EN UN EVENTO, SE MUESTRA
  if ($eventButton) {
    const eventObject = this.relatedEvents[Number($eventButton.dataset.eventPosition)];
    return eventObject.showEvent($eventButton);
  }
  // SI CLICKEAS EN UN ESPACIO VACIO, CREA UN NUEVO EVENTO
  const lastEvent = this.week.events.reduce((acc, event) => (acc.id < event.id ? event : acc));
  const newEventID = lastEvent.id + 1;
  const hourHeight = this.offsetHeight / 24;
  const clickY = e.offsetY;
  const startHour = Math.floor(clickY / hourHeight);
  const start = new Date(this.dataset.year, this.dataset.month, this.dataset.day, startHour);
  const end = addHours(start, 1);
  const newEvent = new CalendarEvent({
    id: newEventID,
    creator: this.week.owner,
    start,
    end,
  });
  this.week.events.push(newEvent);
  return this.week.addEvent(newEventID);
}
