import { format } from 'date-fns';
import Calendar from '../Calendar.js';
import sortEvents from '../utilities.js';
import {
  attachRelatedCalendarToEvents, getRelatedEvents, showEventsPerDay,
  modifyEventStartOrEndTime, placeEvents, attachRelatedCalendarToDayElement,
  attachRelatedEventsToDayElement, attachListenerToDayElement, getWeek,
  handleDateSelector, showNewEvent, removeWeekEventListeners,
} from './utilities.js';

export default class Weekly extends Calendar {
  constructor(owner, events, showWeekends, date) {
    super(owner, events, showWeekends);
    this.dates = getWeek(date);
  }

  showTopBar() {
    const formattedDates = `${format(this.dates[0], 'dd MMM')} - ${format(this.dates[6], 'dd MMM')}`;

    const topBar = `
      <div class="row text-center align-items-center m-1">
        <ul class="pagination col-4 m-0 pl-5">
          <li id="previous-button" data-keyword="backward" class="page-item"><a class="page-link" href="#">Previous</a></li>
          <li id="today-button" data-keyword="today" class="page-item"><a class="page-link show-week pl-2 pr-2" href="#">${formattedDates}</a></li>
          <li id="next-button" data-keyword="forward" class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
        <div class="col-4" style="font-size: 24px">
          Calendar
        </div>
        <button class="col-2 border border-primary rounded view">
          View: Weekly
        </button>
        <div id="manage-user" class="col-2 pl-5">
          <button type="button" class="btn btn-primary" data-active-user="${this.owner.toLowerCase()}">
            ${this.owner}
          </button>
        </div>
      </div>`;
    document.querySelector('#top-bar').innerHTML = topBar;

    const $previousBtn = document.querySelector('#previous-button');
    const $todayBtn = document.querySelector('#today-button');
    const $nextBtn = document.querySelector('#next-button');

    $previousBtn.addEventListener('click', (e) => handleDateSelector(e.currentTarget, this), { once: true });
    $todayBtn.addEventListener('click', (e) => handleDateSelector(e.currentTarget, this), { once: true });
    $nextBtn.addEventListener('click', (e) => handleDateSelector(e.currentTarget, this), { once: true });
  }

  showCalendar() {
    const timetable = Array.from({ length: 24 }, (a, index) => `
      <div class="times pr-1" data-hour="${index}">
        <span class="elevate">${index}.00</span>
      </div>`).join('');
    const weekDays = this.dates.map((date) => format(date, 'EEEE dd'));
    const daysNo = this.dates.map((date) => format(date, 'dd'));
    const monthsNo = this.dates.map((date) => format(date, 'MM'));
    const yearsNo = this.dates.map((date) => format(date, 'yyyy'));
    document.querySelectorAll('.day').forEach((day, index) => {
      day.textContent = format(this.dates[index], 'EEEE dd');
    });
    const calendar = `
      <div class="week week-days border-bottom">
        <div class="" scope="col"></div>
        <h5 class="day border-right" scope="col">${weekDays[0]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[1]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[2]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[3]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[4]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[5]}</h5>
        <h5 class="day border-right" scope="col">${weekDays[6]}</h5>
      </div>
      <div class="week border-bottom">
        <span scope="col" class="timezone">GMT -3</span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
        <span class="events-qty mb-1 mt-1 border-right" scope="col"></span>
      </div>
      <div class="week-data pt-3">
        <div class="modal-outer"></div>
        <div class="timetable">
          ${timetable}
        </div>
        <div class="gridY" data-day="${daysNo[0]}" data-month="${monthsNo[0] - 1}" data-year="${yearsNo[0]}"></div>
        <div class="gridY" data-day="${daysNo[1]}" data-month="${monthsNo[1] - 1}" data-year="${yearsNo[1]}"></div>
        <div class="gridY" data-day="${daysNo[2]}" data-month="${monthsNo[2] - 1}" data-year="${yearsNo[2]}"></div>
        <div class="gridY" data-day="${daysNo[3]}" data-month="${monthsNo[3] - 1}" data-year="${yearsNo[3]}"></div>
        <div class="gridY" data-day="${daysNo[4]}" data-month="${monthsNo[4] - 1}" data-year="${yearsNo[4]}"></div>
        <div class="gridY" data-day="${daysNo[5]}" data-month="${monthsNo[5] - 1}" data-year="${yearsNo[5]}"></div>
        <div class="gridY" data-day="${daysNo[6]}" data-month="${monthsNo[6] - 1}" data-year="${yearsNo[6]}"></div>
      </div>`;
    document.querySelector('#calendar').innerHTML = calendar;
  }

  showEvents() {
    attachRelatedCalendarToEvents(this);
    const $days = document.querySelectorAll('.gridY');
    $days.forEach((day, index) => {
      const relatedEvents = getRelatedEvents(this, index);
      showEventsPerDay(index, relatedEvents);
      modifyEventStartOrEndTime(day, relatedEvents);
      placeEvents(relatedEvents, day);
      attachRelatedCalendarToDayElement(this, day);
      attachRelatedEventsToDayElement(relatedEvents, day);
      attachListenerToDayElement(day);
    });
  }

  addEvent(newEvent) {
    this.events.push(newEvent);
    this.updateEvents();
    showNewEvent(newEvent.id, this.events);
  }

  deleteEvent(deletedEvent) {
    this.events = this.events.filter((event) => event.id !== deletedEvent.id);
    this.updateEvents();
  }

  modifyEvent(modifiedEvent) {
    this.events = this.events.map((event) => {
      if (event.id === modifiedEvent.id) {
        return modifiedEvent;
      }
      return event;
    });

    this.updateEvents();
  }

  updateEvents() {
    sortEvents(this.events);
    removeWeekEventListeners();
    this.showEvents();
  }
}
