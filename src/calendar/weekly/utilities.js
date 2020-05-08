import {
  format, formatDistanceStrict, eachDayOfInterval, add, sub,
} from 'date-fns';
import { isDark, widthPxToPc, changeDate } from '../../utilities.js';
import CalendarEvent from '../../calendarEvent/CalendarEvent.js';

const cloneDeep = require('lodash.clonedeep');

function checkOverlap(day) {
  const events = Array.from(day.children);
  for (let x = 0; x < events.length - 1; x += 1) {
    let overlap = false;
    for (let y = 1; y < (events.length - x); y += 1) {
      if (events[x].getBoundingClientRect().bottom > events[x + y].getBoundingClientRect().top) {
        const left = Number(events[x + y].style.left.replace('%', ''));
        events[x + y].style.left = events[x + y].style.left ? `${left * 1.5}%` : '48%';
        events[x + y].style.width = `${widthPxToPc((events[x + y].offsetWidth / 2) - 1, day)}%`;
        overlap = true;
      }
    }
    if (overlap) events[x].style.width = `${widthPxToPc((events[x].offsetWidth / 2) - 1, day)}%`;
  }
  events.forEach((event) => {
    if (event.lastElementChild.offsetHeight < 15) {
      event.lastElementChild.style.alignItems = 'flex-start';
    }
  });
}

function minutePx() {
  return (document.querySelector('[data-hour="0"]').offsetHeight) / 60;
}

function minutePercentage(day) {
  const hourHeight = document.querySelector('.times').offsetHeight;
  const dayHeight = day.offsetHeight;
  return (hourHeight / dayHeight / 60) * 100;
}

export function attachRelatedCalendarToEvents(calendar) {
  calendar.events.forEach((event) => {
    event.relatedCalendar = calendar;
  });
}

export function getRelatedEvents(calendar, dayIndex) {
  const fullDate = format(calendar.dates[dayIndex], 'yyyy-MM-dd');
  const relatedEvents = calendar.events.filter((event) => {
    const startDay = format(event.start, 'yyyy-MM-dd');
    const endDay = format(sub(event.end, { minutes: 1 }), 'yyyy-MM-dd');
    return [startDay, endDay].includes(fullDate);
  });
  return relatedEvents;
}

export function showEventsPerDay(dayIndex, events) {
  document.querySelectorAll('.events-qty')[dayIndex].textContent = `${events.length} events`;
}

export function modifyEventStartOrEndTime($day, events) {
  const dayNumber = Number($day.dataset.day);
  events.forEach((event, eventNo) => {
    const startDate = event.start.getDate();
    const endDate = event.end.getDate();

    if (dayNumber !== endDate) {
      const newEndTime = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate(),
        23, 59, 59, 999,
      );
      const modifiedEvent = cloneDeep(event);
      modifiedEvent.newEnd = newEndTime;
      events[eventNo] = modifiedEvent;
    }

    if (dayNumber !== startDate) {
      const newStartTime = new Date(
        event.end.getFullYear(),
        event.end.getMonth(),
        event.end.getDate(),
      );
      const modifiedEvent = cloneDeep(event);
      modifiedEvent.newStart = newStartTime;
      events[eventNo] = modifiedEvent;
    }
  });
}

export function placeEvents(events, $day) {
  const relocatedEvents = events.map((event, position) => {
    const start = event.newStart || event.start;
    const end = event.newEnd || event.end;
    const startHour = start.getHours();
    const startMinutesPx = start.getMinutes() * minutePx();
    const startEventY = $day.getBoundingClientRect().top;
    const startTimeY = document.querySelector(`[data-hour="${startHour}"]`).getBoundingClientRect().top;
    const durationStr = formatDistanceStrict(start, end, { unit: 'minute' });
    const duration = Number(durationStr.replace(' minutes', ''));
    const eventDuration = duration * minutePercentage($day);
    const relocationY = `${startTimeY - startEventY + startMinutesPx}px`;
    const style = `
      color: ${isDark(event.color) ? '#f6fff8' : ''};
      background-color: ${event.color};
      top: ${relocationY};
      height: ${eventDuration}%;`;
    return `
      <button style="${style}" class="event ml-1" data-event-position="${position}" data-event-id="${event.id}">
        <div class="event-summary m-0">${event.summary}</div>
        <div class="event-info">
          ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}
        </div>
      </button>`;
  }).join('');

  $day.innerHTML = relocatedEvents;

  checkOverlap($day);
}

export function attachRelatedCalendarToDayElement(calendar, $day) {
  $day.week = calendar;
}

export function attachRelatedEventsToDayElement(events, $day) {
  $day.relatedEvents = events;
}

export function getWeek(date) {
  return eachDayOfInterval({ start: date, end: add(date, { days: 6 }) });
}

export function autoScroll() {
  if (new Date().getHours() > 9) {
    const now = new Date().getHours();
    const $hour = document.querySelector(`[data-hour="${now - 3}"]`);
    $hour.scrollIntoView();
  }
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
  autoScroll();
}

function createNewEvent($day, e) {
  const lastEvent = $day.week.events.reduce((acc, event) => (acc.id < event.id ? event : acc));
  const hourHeight = $day.offsetHeight / 24;
  const clickY = e.offsetY;
  const startHour = Math.floor(clickY / hourHeight);

  const id = lastEvent.id + 1;
  const start = new Date($day.dataset.year, $day.dataset.month, $day.dataset.day, startHour);
  const end = add(start, { hours: 1 });
  const newEvent = new CalendarEvent({
    id,
    creator: $day.week.owner,
    start,
    end,
  });

  return $day.week.addEvent(newEvent);
}

export function handleClick(e) {
  const $day = e.target.closest('.gridY');
  const $eventButton = e.target.closest('.event');
  if ($eventButton) {
    const eventObject = $day.relatedEvents[Number($eventButton.dataset.eventPosition)];
    return eventObject.showEvent($eventButton);
  }
  return createNewEvent($day, e);
}

export function attachListenerToDayElement($day) {
  $day.addEventListener('click', handleClick);
}

export function removeWeekEventListeners() {
  const days = document.querySelectorAll('.gridY');
  days.forEach((day) => {
    day.removeEventListener('click', handleClick);
  });
}

export function showNewEvent(eventID, events) {
  const lastEvent = events.find((event) => event.id === eventID);
  const $eventButton = document.querySelector(`button[data-event-id="${lastEvent.id}"]`);
  lastEvent.showEvent($eventButton);
}
