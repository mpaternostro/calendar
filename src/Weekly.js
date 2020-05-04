import {
  format, add, eachDayOfInterval, formatDistanceStrict,
} from 'date-fns';
import { cloneDeep } from 'lodash-es';
import { widthPxToPc, isDark, changeDate } from './utilities.js';
import { getWeek, handleDateSelector, handleClick } from './Weekly.utilities.js';
import Calendar from './Calendar.js';

function minutePx() {
  return (document.querySelector('[data-hour="0"]').offsetHeight) / 60;
}

function minutePercentage(day) {
  const hourHeight = document.querySelector('.times').offsetHeight;
  const dayHeight = day.offsetHeight;
  return (hourHeight / dayHeight / 60) * 100;
}

export function autoScroll() {
  const now = new Date().getHours();
  const $hour = document.querySelector(`[data-hour="${now - 3}"]`);
  $hour.scrollIntoView();
}

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

export default class Weekly extends Calendar {
  static getWeek(date) {
    return eachDayOfInterval({ start: date, end: add(date, { days: 6 }) });
  }

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
        <button class="col-2 border border-primary rounded">
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
    const timetable = Array.from({ length: 24 }, (a, index) => `<div class="times pr-1" data-hour="${index}"><span class="elevate">${index}.00</span></div>`).join('');
    const weekDays = this.dates.map((date) => format(date, 'EEEE dd'));
    const daysNumber = this.dates.map((date) => format(date, 'dd'));
    const monthsNumber = this.dates.map((date) => format(date, 'MM'));
    const yearsNumber = this.dates.map((date) => format(date, 'yyyy'));
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
        <div class="gridY" data-day="${daysNumber[0]}" data-month="${monthsNumber[0] - 1}" data-year="${yearsNumber[0]}"></div>
        <div class="gridY" data-day="${daysNumber[1]}" data-month="${monthsNumber[1] - 1}" data-year="${yearsNumber[1]}"></div>
        <div class="gridY" data-day="${daysNumber[2]}" data-month="${monthsNumber[2] - 1}" data-year="${yearsNumber[2]}"></div>
        <div class="gridY" data-day="${daysNumber[3]}" data-month="${monthsNumber[3] - 1}" data-year="${yearsNumber[3]}"></div>
        <div class="gridY" data-day="${daysNumber[4]}" data-month="${monthsNumber[4] - 1}" data-year="${yearsNumber[4]}"></div>
        <div class="gridY" data-day="${daysNumber[5]}" data-month="${monthsNumber[5] - 1}" data-year="${yearsNumber[5]}"></div>
        <div class="gridY" data-day="${daysNumber[6]}" data-month="${monthsNumber[6] - 1}" data-year="${yearsNumber[6]}"></div>
      </div>`;
    document.querySelector('#calendar').innerHTML = calendar;
  }

  showEvents() {
    // ADJUNTA EL CALENDARIO CORRESPONDIENTE AL EVENTO
    this.events.forEach((event) => {
      event.relatedCalendar = this;
    });
    document.querySelectorAll('.gridY').forEach((day, index) => {
      const dayNumber = Number(day.dataset.day);
      const fullDate = format(this.dates[index], 'yyyy-MM-dd');
      // OBTIENE EVENTOS CORRESPONDIENTES PARA ESTE DIA
      const relatedEvents = this.events.filter((event) => {
        const startDay = format(event.start, 'yyyy-MM-dd');
        const endDay = format(event.end, 'yyyy-MM-dd');
        return [startDay, endDay].includes(fullDate);
      });

      // ACTUALIZA CANTIDAD DE EVENTOS POR DIA
      document.querySelectorAll('.events-qty')[index].textContent = `${relatedEvents.length} events`;

      // MODIFICAR EVENTOS QUE EMPIEZAN UN DIA Y TERMINAN EN OTRO DIA
      relatedEvents.forEach((event, eventNo) => {
        const startDate = event.start.getDate();
        const endDate = event.end.getDate();
        // EL CASO EN EL QUE EL DIA 1 TIENE UN EVENTO QUE TERMINA EL DIA 2
        if (dayNumber !== endDate) {
          const newEndTime = new Date(
            event.start.getFullYear(),
            event.start.getMonth(),
            event.start.getDate(),
            23, 59, 59, 999,
          );
          const modifiedEvent = cloneDeep(event);
          modifiedEvent.newEnd = newEndTime;
          relatedEvents[eventNo] = modifiedEvent;
        }
        // EL CASO EN EL QUE EL DIA 2 TIENE UN EVENTO QUE EMPIEZA EL DIA 1
        if (dayNumber !== startDate) {
          const newStartTime = new Date(
            event.end.getFullYear(),
            event.end.getMonth(),
            event.end.getDate(),
          );
          const modifiedEvent = cloneDeep(event);
          modifiedEvent.newStart = newStartTime;
          relatedEvents[eventNo] = modifiedEvent;
        }
      });

      // CREA LOS ELEMENTOS CON LOS ESTILOS Y LOS AGREGA AL DOM
      const relocatedEvents = relatedEvents.map((event, position) => {
        const start = event.newStart || event.start;
        const end = event.newEnd || event.end;
        const startHour = start.getHours();
        const startMinutesPx = start.getMinutes() * minutePx();
        const startEventY = day.getBoundingClientRect().top;
        const startTimeY = document.querySelector(`[data-hour="${startHour}"]`).getBoundingClientRect().top;
        const durationStr = formatDistanceStrict(start, end, { unit: 'minute' });
        const duration = Number(durationStr.replace(' minutes', ''));
        const eventDuration = duration * minutePercentage(day);
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

      day.innerHTML = relocatedEvents;

      checkOverlap(day);

      day.week = this;
      day.relatedEvents = relatedEvents;
      // LE PONE UN LISTENER AL DIA
      day.addEventListener('click', handleClick);
    });
  }

  addEvent(newEventID) {
    // AGARRA EL NUEVO EVENTO, LO AGREGA A THIS.EVENTS Y MANDA A UPDATEAR
    this.updateEvents();

    // ABRE EL MODAL PARA MODIFICAR ESE NUEVO EVENTO
    const lastEvent = this.events.find((event) => event.id === newEventID);
    const $eventButton = document.querySelector(`button[data-event-id="${lastEvent.id}"]`);
    lastEvent.showEvent($eventButton);
  }

  deleteEvent(deletedEvent) {
    // FILTRA Y MANDA A UPDATEAR
    this.events = this.events.filter((event) => event.id !== deletedEvent.id);
    this.updateEvents();
  }

  modifyEvent(modifiedEvent) {
    // MAPEA Y MANDA A UPDATEAR
    this.events = this.events.map((event) => {
      if (event.id === modifiedEvent.id) {
        return modifiedEvent;
      }
      return event;
    });

    this.updateEvents();
  }

  updateEvents() {
    this.events.sort((a, b) => a.start.getTime() - b.start.getTime());
    const days = document.querySelectorAll('.gridY');
    days.forEach((day) => {
      day.removeEventListener('click', handleClick);
    });
    this.showEvents();
  }
}
