import {
  format, add, eachDayOfInterval, formatDistanceStrict,
} from 'date-fns';
import { cloneDeep } from 'lodash-es';
import Calendar from './Calendar.js';
import { widthPxToPc, isDark } from './utilities.js';

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
  constructor(owner, events, showWeekends, date) {
    super(owner, events, showWeekends);
    this.dates = eachDayOfInterval({ start: date, end: add(date, { days: 6 }) });
  }

  showTopBar() {
    const formattedDates = `${format(this.dates[0], 'dd MMM')} - ${format(this.dates[6], 'dd MMM')}`;

    const topBar = `
      <div class="row text-center align-items-center m-1">
        <button class="col-3 border border-primary rounded">
          ${formattedDates}
        </button>
        <div class="col-6" style="font-size: 24px">
          Calendar
        </div>
        <button class="col-2 border border-primary rounded">
          View: Weekly
        </button>
        <div id="manage-user" class="col-1">
          <button type="button" class="btn btn-primary" data-active-user="${this.owner.toLowerCase()}">
            ${this.owner}
          </button>
        </div>
      </div>`;
    document.querySelector('#top-bar').innerHTML = topBar;
  }

  showCalendar() {
    const timetable = Array.from({ length: 24 }, (a, index) => `<div class="times pr-1" data-hour="${index}"><span class="elevate">${index}.00</span></div>`).join('');
    const weekDays = this.dates.map((date) => format(date, 'EEEE dd'));
    const daysNumber = this.dates.map((date) => format(date, 'dd'));
    document.querySelectorAll('.day').forEach((day, index) => {
      day.textContent = format(this.dates[index], 'EEEE dd');
    });
    const calendar = `
      <div class="week week-days border-bottom">
        <h6 scope="col" class="timezone"></h6>
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
        <div class="gridY" data-day="${daysNumber[0]}"></div>
        <div class="gridY" data-day="${daysNumber[1]}"></div>
        <div class="gridY" data-day="${daysNumber[2]}"></div>
        <div class="gridY" data-day="${daysNumber[3]}"></div>
        <div class="gridY" data-day="${daysNumber[4]}"></div>
        <div class="gridY" data-day="${daysNumber[5]}"></div>
        <div class="gridY" data-day="${daysNumber[6]}"></div>
      </div>
      `;
    document.querySelector('#calendar').innerHTML = calendar;
  }

  showEvents() {
    document.querySelectorAll('.gridY').forEach((day, index) => {
      const dayNumber = Number(day.dataset.day);
      // OBTIENE EVENTOS CORRESPONDIENTES PARA ESTE DIA
      const relatedEvents = this.events.filter((event) => {
        const startDay = event.start.getDate();
        const endDay = event.end.getDate();
        return [startDay, endDay].includes(dayNumber);
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
      const relocatedEvents = relatedEvents.map((event) => {
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
        <button style="${style}" class="event ml-1">
          <div class="event-summary m-0">${event.summary}</div>
          <div class="event-info">
            ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}
          </div>
        </button>`;
      }).join('');

      day.innerHTML = relocatedEvents;

      checkOverlap(day);

      day.querySelectorAll('.event').forEach((event, eventNo) => {
        const eventObject = relatedEvents[eventNo];
        event.addEventListener('click', (e) => eventObject.showEvent(e));
      });
    });
  }

  // hacer que te remarque el dia actual (si este se esta mostrando) con algo, lo que sea
}
