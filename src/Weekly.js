import Calendar from './Calendar.js';

function pxToVh(px) {
  return (px / window.innerHeight) * 100;
}

function minuteVh() {
  return pxToVh((document.querySelector('[data-hour="0"]').offsetHeight) / 60);
}

export default class Weekly extends Calendar {
  constructor(owner, events, showWeekends, dates) {
    super(owner, events, showWeekends);
    this.dates = dates;
  }

  showTopBar() {
    this.topBar = `
      <div class="row text-center align-items-center m-1">
        <div class="col-3">
          ${this.dates}
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

    this.eventsHTML = this.events.map((event) => {
      this.getEventTimes(event);
      return `
      <div class="event">
        <h6 class="m-0">${event.summary}</h6>
        <div class="event-info" data-start-hour="${this.startHour}" data-start-minutes="${this.startMinutes}"
        data-end-hour="${this.endHour}" data-end-minutes="${this.endMinutes}">
          ${this.start} - ${this.end}
        </div>
      </div>`;
    });

    this.calendar = `
      <div class="week week-days">
        <h6 scope="col" class="timezone"></h6>
        <h5 scope="col">Monday 28</h5>
        <h5 scope="col">Tuesday 29</h5>
        <h5 scope="col">Wednesday 30</h5>
        <h5 scope="col">Thursday 31</h5>
        <h5 scope="col">Friday 1</h5>
        <h5 scope="col">Saturday 2</h5>
        <h5 scope="col">Sunday 3</h5>
      </div>
      <div class="week events-qty">
        <span scope="col" class="timezone">GMT -3</span>
        <span scope="col"></span>
        <span scope="col">2 events</span>
        <span scope="col"></span>
        <span scope="col"></span>
        <span scope="col"></span>
        <span scope="col"></span>
        <span scope="col"></span>
      </div>
      <div class="week-data pt-3" style="back">
        <div class="timetable">
          ${this.timetable}
        </div>
        <div class="gridY" data-day="1" data-events="1"></div>
        <div class="gridY" data-day="2">${this.eventsHTML.join('')}</div>
        <div class="gridY" data-day="3"></div>
        <div class="gridY" data-day="4"></div>
        <div class="gridY" data-day="5"></div>
        <div class="gridY" data-day="6"></div>
        <div class="gridY" data-day="7"></div>
      </div>
      `;
    document.querySelector('#calendar').innerHTML = this.calendar;
  }

  showEvents() {
    this.events.forEach((event, index) => {
      this.getEventTimes(event);
      this.relocatedEvents = document.querySelectorAll('.event');

      this.startHour = this.relocatedEvents[index].lastElementChild.dataset.startHour;
      this.startEventY = pxToVh(this.relocatedEvents[index].getBoundingClientRect().top);
      this.startTimeY = pxToVh(document.querySelector(`[data-hour="${this.startHour}"]`).getBoundingClientRect().top);
      this.eventMinutes = (this.relocatedEvents[index].lastElementChild.dataset.startMinutes);
      this.eventMinutesHeigth = this.eventMinutes * minuteVh();

      this.relocationY = `${this.startTimeY - this.startEventY + this.eventMinutesHeigth}vh`;
      this.durationInVh = this.durationMinutes * minuteVh();

      this.relocatedEvents[index].style = `
        transform: translateY(${this.relocationY});
        height: ${this.durationInVh}vh;`;
    });
  }
}
