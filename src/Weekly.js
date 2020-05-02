import {
  format, add, eachDayOfInterval, formatDistanceStrict,
} from 'date-fns';
import { cloneDeep } from 'lodash-es';
import Calendar from './Calendar.js';

function minutePx() {
  return (document.querySelector('[data-hour="0"]').offsetHeight) / 60;
}

function pxToPc(px, column) {
  return (px / column.offsetWidth) * 100;
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
        const left = Number(events[x + y].style.left.replace(/%/, ''));
        events[x + y].style.left = events[x + y].style.left ? `${left * 1.5}%` : '48%';
        events[x + y].style.width = `${pxToPc((events[x + y].offsetWidth / 2) - 1, day)}%`;
        overlap = true;
      }
    }
    if (overlap) events[x].style.width = `${pxToPc((events[x].offsetWidth / 2) - 1, day)}%`;
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
    this.formattedDates = `${format(this.dates[0], 'dd MMM')} - ${format(this.dates[6], 'dd MMM')}`;

    this.topBar = `
      <div class="row text-center align-items-center m-1">
        <div class="col-3">
          ${this.formattedDates}
        </div>
        <div class="col-6" style="font-size: 24px">
          Calendar
        </div>
        <div class="col-2">
          View: Weekly
        </div>
        <div id="manage-user" class="col-1">
          <button type="button" class="btn btn-primary">
            ${this.owner}
          </button>
        </div>
      </div>`;
    document.querySelector('#top-bar').innerHTML = this.topBar;
  }

  showCalendar() {
    this.timetable = Array.from({ length: 24 }, (a, index) => `<div class="times pr-1" data-hour="${index}"><span class="elevate">${index}.00</span></div>`).join('');
    this.weekDays = this.dates.map((date) => format(date, 'EEEE dd'));
    this.daysNumber = this.dates.map((date) => format(date, 'dd'));
    document.querySelectorAll('.day').forEach((day, index) => {
      day.textContent = format(this.dates[index], 'EEEE dd');
    });
    this.calendar = `
      <div class="week week-days">
        <h6 scope="col" class="timezone"></h6>
        <h5 class="day" scope="col">${this.weekDays[0]}</h5>
        <h5 class="day" scope="col">${this.weekDays[1]}</h5>
        <h5 class="day" scope="col">${this.weekDays[2]}</h5>
        <h5 class="day" scope="col">${this.weekDays[3]}</h5>
        <h5 class="day" scope="col">${this.weekDays[4]}</h5>
        <h5 class="day" scope="col">${this.weekDays[5]}</h5>
        <h5 class="day" scope="col">${this.weekDays[6]}</h5>
      </div>
      <div class="week border-bottom">
        <span scope="col" class="timezone">GMT -3</span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
        <span class="events-qty" scope="col"></span>
      </div>
      <div class="week-data pt-3" style="back">
        <div class="timetable">
          ${this.timetable}
        </div>
        <div class="gridY" data-day="${this.daysNumber[0]}"></div>
        <div class="gridY" data-day="${this.daysNumber[1]}"></div>
        <div class="gridY" data-day="${this.daysNumber[2]}"></div>
        <div class="gridY" data-day="${this.daysNumber[3]}"></div>
        <div class="gridY" data-day="${this.daysNumber[4]}"></div>
        <div class="gridY" data-day="${this.daysNumber[5]}"></div>
        <div class="gridY" data-day="${this.daysNumber[6]}"></div>
      </div>
      `;
    document.querySelector('#calendar').innerHTML = this.calendar;
  }

  showEvents() {
    document.querySelectorAll('.gridY').forEach((day, index) => {
      this.dayNumber = Number(day.dataset.day);
      // OBTIENE EVENTOS CORRESPONDIENTES PARA ESTE DIA
      this.relatedEvents = this.events.filter((event) => {
        this.startDay = new Date(event.start).getDate();
        this.endDay = new Date(event.end).getDate();
        return [this.startDay, this.endDay].includes(this.dayNumber);
      });
      // ACTUALIZA CANTIDAD DE EVENTOS POR DIA
      document.querySelectorAll('.events-qty')[index].textContent = `${this.relatedEvents.length} events`;

      // MODIFICAR EVENTOS QUE EMPIEZAN UN DIA Y TERMINAN EN OTRO DIA
      this.relatedEvents.forEach((event, eventNo) => {
        this.startDate = new Date(event.start).getDate();
        this.endDate = new Date(event.end).getDate();
        // EL CASO EN EL QUE EL DIA 1 TIENE UN EVENTO QUE TERMINA EL DIA 2
        if (this.dayNumber !== this.endDate) {
          const newEndTime = new Date(
            new Date(event.start).getFullYear(),
            new Date(event.start).getMonth(),
            new Date(event.start).getDate(),
            23, 59, 59, 999,
          ).toJSON();
          const modifiedEvent = cloneDeep(event);
          modifiedEvent.newEnd = newEndTime;
          this.relatedEvents[eventNo] = modifiedEvent;
        }
        // EL CASO EN EL QUE EL DIA 2 TIENE UN EVENTO QUE EMPIEZA EL DIA 1
        if (this.dayNumber !== this.startDate) {
          const newStartTime = new Date(
            new Date(event.end).getFullYear(),
            new Date(event.end).getMonth(),
            new Date(event.end).getDate(),
          ).toJSON();
          const modifiedEvent = cloneDeep(event);
          modifiedEvent.newStart = newStartTime;
          this.relatedEvents[eventNo] = modifiedEvent;
        }
      });

      // CREA LOS ELEMENTOS CON LOS ESTILOS
      this.relocatedEvents = this.relatedEvents.map((event) => {
        this.start = event.newStart || event.start;
        this.end = event.newEnd || event.end;
        this.startHour = new Date(this.start).getHours();
        this.startMinutesPx = new Date(this.start).getMinutes() * minutePx();
        this.startEventY = day.getBoundingClientRect().top;
        this.startTimeY = document.querySelector(`[data-hour="${this.startHour}"]`).getBoundingClientRect().top;
        this.durationStr = formatDistanceStrict(new Date(this.start), new Date(this.end), { unit: 'minute' });
        this.duration = Number(this.durationStr.replace(/\sminutes/g, ''));
        this.eventDuration = this.duration * minutePercentage(day);
        this.relocationY = `${this.startTimeY - this.startEventY + this.startMinutesPx}px`;

        this.style = `
          top: ${this.relocationY};
          height: ${this.eventDuration}%;`;
        return `
        <button style="${this.style}" class="event ml-1">
          <div class="event-summary m-0">${event.summary}</div>
          <div class="event-info">
            ${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}
          </div>
        </button>`;
      }).join('');

      day.innerHTML = this.relocatedEvents;

      checkOverlap(day);
    });
  }

  // hacer que te remarque el dia actual (si este se esta mostrando) con algo, lo que sea
}
