// eslint-disable-next-line spaced-comment
/// <reference types="Jest" />

import Weekly from '../Weekly.js';
import CalendarEvent from '../../../calendarEvent/CalendarEvent.js';
import { handleDateSelector, handleClick } from '../utilities.js';
import events from './events.fixture.js';

describe('crea un nuevo calendario semanal', () => {
  document.body.innerHTML = `
  <div class="d-flex flex-column p-1 bd-highlight">
    <div id="top-bar" class="mb-1 p-1 border-bottom rounded header-color">
      <!-- TOP BAR -->
    </div>
    <table id="calendar">
      <!-- CALENDAR -->
    </table>
  </div>`;

  const eventsDateFix = events.map((event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    return event;
  });
  const calendar = new Weekly('Test', eventsDateFix, true, events[0].start);
  calendar.showTopBar();
  calendar.showCalendar();
  calendar.showEvents();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('agrega nuevo evento', () => {
    const newEvent = new CalendarEvent({
      id: 3, creator: 'Test Test', start: new Date(), end: new Date(),
    });
    jest.spyOn(calendar, 'showEvents').mockImplementationOnce(() => '');
    jest.spyOn(newEvent, 'showEvent').mockImplementationOnce(() => '');
    calendar.addEvent(newEvent);
    expect(calendar.showEvents).toBeCalledTimes(1);
    expect(newEvent.showEvent).toBeCalledTimes(1);
  });

  test('borra evento', () => {
    jest.spyOn(calendar, 'showEvents').mockImplementationOnce(() => '');
    calendar.deleteEvent(events[1]);
    expect(calendar.showEvents).toBeCalledTimes(1);
    expect(calendar.events).toHaveLength(2);
  });

  test('modifica evento', () => {
    jest.spyOn(calendar, 'showEvents').mockImplementationOnce(() => '');
    const modifiedEvent = new CalendarEvent({
      id: 3, creator: 'Test Test', start: new Date(), end: new Date(), description: 'Evento modificado',
    });
    calendar.modifyEvent(modifiedEvent);
    expect(calendar.showEvents).toBeCalledTimes(1);
    expect(calendar.events[1].description).toBe('Evento modificado');
  });

  test('cambia de semana', () => {
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    jest.spyOn(calendar, 'showTopBar').mockImplementationOnce(() => '');
    jest.spyOn(calendar, 'showCalendar').mockImplementationOnce(() => '');
    jest.spyOn(calendar, 'showEvents').mockImplementationOnce(() => '');
    const $previousBtn = document.querySelector('#previous-button');
    const $nextBtn = document.querySelector('#next-button');
    const $todayBtn = document.querySelector('#today-button');

    handleDateSelector($previousBtn, calendar);
    expect(calendar.showTopBar).toBeCalledTimes(1);
    expect(calendar.showCalendar).toBeCalledTimes(1);
    expect(calendar.showEvents).toBeCalledTimes(1);

    handleDateSelector($nextBtn, calendar);
    expect(calendar.showTopBar).toBeCalledTimes(2);
    expect(calendar.showCalendar).toBeCalledTimes(2);
    expect(calendar.showEvents).toBeCalledTimes(2);

    handleDateSelector($todayBtn, calendar);
    expect(calendar.showTopBar).toBeCalledTimes(3);
    expect(calendar.showCalendar).toBeCalledTimes(3);
    expect(calendar.showEvents).toBeCalledTimes(3);
  });

  test('clickea en el calendario', () => {
    const $event = document.querySelector('.event');
    const $day = document.querySelector('.gridY');
    const event = $day.relatedEvents[0];
    jest.spyOn(event, 'showEvent').mockImplementationOnce(() => '');
    jest.spyOn(calendar, 'addEvent').mockImplementationOnce(() => '');

    const clickEventEl = { target: $event };
    handleClick(clickEventEl);
    expect(event.showEvent).toBeCalledTimes(1);

    const clickDayEl = { target: $day };
    handleClick(clickDayEl);
    expect(calendar.addEvent).toBeCalledTimes(1);
  });
});
