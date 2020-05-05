import { format } from 'date-fns';
import { cloneDeep } from 'lodash-es';
import { widthPxToPc, isDark } from './utilities.js';
import getParticipantsHTML from './CalendarEvents.utilities.js';

export default class CalendarEvent {
  static defaultAttendees() {
    return [
      {
        id: 1,
        email: 'test@test.com',
        displayName: 'Test Test',
        organizer: true,
        self: true,
        responseStatus: null,
        hide: false,
      },
      {
        id: 2,
        email: 'test2@test.com',
        displayName: 'Test2 Test',
        organizer: false,
        self: false,
        responseStatus: null,
        hide: true,
      },
      {
        id: 3,
        email: 'test3@test.com',
        displayName: 'Test3 Test',
        organizer: false,
        self: false,
        responseStatus: null,
        hide: true,
      },
    ];
  }

  constructor({
    id, created = new Date(), updated = new Date(), summary = 'New Event',
    description = 'New event description', color = '#2e84d5', creator,
    start, end, attendees = CalendarEvent.defaultAttendees(),
  }) {
    this.id = id;
    this.created = new Date(created);
    this.updated = new Date(updated);
    this.summary = summary;
    this.description = description;
    this.color = color;
    this.creator = creator;
    this.start = new Date(start);
    this.end = new Date(end);
    this.attendees = attendees;
  }

  deleteEvent() {
    this.relatedCalendar.deleteEvent(this);
  }

  addParticipant(participantID) {
    const $participants = document.querySelector('.participants');
    if (!this.attendeesClone) this.attendeesClone = cloneDeep(this.attendees);
    const participant = this.attendeesClone.find((attendee) => attendee.id === participantID);
    participant.hide = false;
    $participants.innerHTML = getParticipantsHTML(this.attendeesClone);
  }

  modifyEvent() {
    const $general = document.querySelector('.general');
    // ITERA SOBRE LOS INPUT DE TIPO TEXTO
    const $inputsText = $general.querySelectorAll('input[type="text"]');
    $inputsText.forEach((input) => {
      this[input.id] = input.value;
    });

    const $inputColor = $general.querySelector('input[type="color"]');
    this.color = $inputColor.value;

    // ITERA SOBRE LOS INPUT DE TIPO DATETIME-LOCAL
    const $inputsDate = $general.querySelectorAll('input[type="datetime-local"]');
    if (new Date($inputsDate[0].value).getTime() > new Date($inputsDate[1].value).getTime()) return;
    $inputsDate.forEach((input) => {
      this[input.name] = new Date(input.value);
    });

    // ITERA SOBRE LA ASISTENCIA
    const $attendance = Array.from(document.querySelectorAll('#attendance'));

    // ITERA SOBRE LOS SELECTS Y EXTRAE LA SELECCIONADA
    const newAttendance = $attendance.map((select) => {
      const { value } = select.selectedOptions[0];
      if (value === 'Going') return true;
      if (value === 'Not going') return false;
      return null;
    });
    const newAttendeeResponseStatus = this.attendees.map((attendee, i) => {
      attendee.responseStatus = newAttendance[i];
      return attendee;
    });
    this.attendees = newAttendeeResponseStatus;

    // ACTUALIZA EL MOMENTO EN EL QUE SE MODIFICO
    this.updated = new Date();

    // REMUEVE LOS NEWSTART Y ENDSTART, SI SE NECESITAN WEEKLY LOS VA A PONER DE NUEVO
    this.newStart = null;
    this.newEnd = null;

    // LLAMA A QUE ACTUALICEN LOS EVENTOS DEL CALENDARIO
    this.relatedCalendar.modifyEvent(this);
  }

  handleModal(event) {
    const $modalOuter = document.querySelector('.modal-outer');
    const $eventButton = document.querySelector('.event.open');
    const $participants = document.querySelector('.participants');
    let isOutside;
    let isEscape;
    let isCloseBtn;
    let isSave;
    let isDelete;
    let isNewParticipant;
    if (event.type === 'mousedown') {
      isCloseBtn = event.target.closest('#close-button');
      isOutside = !event.target.closest('.event-window');
      isSave = event.target.closest('#save-button');
      isDelete = event.target.closest('#delete-button');
    } else if (event.key === 'Escape') {
      isEscape = true;
    } else if (event.type === 'change' && event.target.selectedOptions[0].dataset.userId) {
      isNewParticipant = Number(event.target.selectedOptions[0].dataset.userId);
    }
    if (isNewParticipant) {
      this.addParticipant(isNewParticipant);
    }
    if (isSave) {
      this.attendees = this.attendeesClone;
      this.modifyEvent();
      $eventButton.classList.remove('open');
      $modalOuter.classList.remove('open');
      $modalOuter.innerHTML = '';
      $modalOuter.removeEventListener('mousedown', this.handleModal);
      window.removeEventListener('keydown', this.handleModal);
      $participants.removeEventListener('change', this.handleModal);
    }
    if (isDelete) {
      this.deleteEvent(this.relatedCalendar);
      $eventButton.classList.remove('open');
      $modalOuter.classList.remove('open');
      $modalOuter.innerHTML = '';
      $modalOuter.removeEventListener('mousedown', this.handleModal);
      window.removeEventListener('keydown', this.handleModal);
      $participants.removeEventListener('change', this.handleModal);
    }
    if (isCloseBtn || isOutside || isEscape) {
      $eventButton.classList.remove('open');
      $modalOuter.classList.remove('open');
      $modalOuter.innerHTML = '';
      $modalOuter.removeEventListener('mousedown', this.handleModal);
      window.removeEventListener('keydown', this.handleModal);
      $participants.removeEventListener('change', this.handleModal);
    }
  }

  showEvent($eventButton) {
    const $calendar = document.querySelector('#calendar');
    const $modalOuter = document.querySelector('.modal-outer');

    const eventWindowPlacement = {
      x: ($eventButton.getBoundingClientRect().left / window.innerWidth) * 100,
      y: ($eventButton.getBoundingClientRect().top / window.innerHeight) * 100,
    };
    const eventButtonWidth = widthPxToPc($eventButton.offsetWidth, $calendar);

    const isDarkFont = isDark(this.color);
    const style = `
    min-height: 25%;
    background-color: ${this.color};
    left: ${eventWindowPlacement.x > 45
    ? eventWindowPlacement.x - eventButtonWidth - 25
    : eventWindowPlacement.x + eventButtonWidth + 2}%;
    top: ${eventWindowPlacement.y > 55 ? eventWindowPlacement.y - 40 : eventWindowPlacement.y + 5}%;`;

    const participantsHTML = getParticipantsHTML(this.attendees);

    const pattern = 'yyyy-MM-dd\'T\'kk:mm';
    const eventWindow = `
      <div style="${style}" class="event-window ${isDarkFont ? 'dark' : ''}" >
        <div class="event-data">
          <div class="general">
            <div class="d-flex">
              <input id="summary" type="text" value="${this.summary}" ${isDarkFont ? 'class= "dark"' : ''}></input>
              <label class="m-0">Color: <input type="color" value="${this.color}"></input></label>
            </div>
            <input id="description" type="text" value="${this.description}" ${isDarkFont ? 'class= "dark"' : ''}></input>
            <div class="start-end-time">
              <label>From: 
                <input name="start" class="event-time ${isDarkFont ? 'dark' : ''}" type="datetime-local" value="${format(this.start, pattern)}"></input>
              </label>
              <label>To: 
                <input name="end" class="event-time ${isDarkFont ? 'dark' : ''}" type="datetime-local" value="${format(this.end, pattern)}"></input>
              </label>
            </div>
            <span class="event-time">Updated: ${this.updated}</span>
            <span class="event-time">Created: ${this.created}</span>
          </div>
          <div class="participants">
            ${participantsHTML}
          </div>
        </div>
        <div class="event-buttons">
          <div><button id="save-button" class="btn btn-primary event-action-button ${isDarkFont ? 'dark' : ''}">Save</button></div>
          <div><button id="close-button" class="btn btn-secondary event-action-button ${isDarkFont ? 'dark' : ''}">Close</button></div>
          <div><button id="delete-button" class="btn btn-danger event-action-button ${isDarkFont ? 'dark' : ''}">Delete</button></div>
        </div>
      </div>`;

    $eventButton.classList.add('open');
    $modalOuter.classList.add('open');
    $modalOuter.innerHTML = eventWindow;
    this.handleModal = this.handleModal.bind(this);

    $modalOuter.addEventListener('mousedown', this.handleModal);
    window.addEventListener('keydown', this.handleModal);
    if (this.attendees.filter((attendee) => attendee.hide === true).length > 0) {
      const $participants = document.querySelector('.participants');
      $participants.addEventListener('change', this.handleModal);
    }
  }
}
