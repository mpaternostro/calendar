import { format } from 'date-fns';
import { isDark } from '../utilities.js';
import {
  getParticipantsHTML, updateEventProperties, updateEventParticipantsAttendance,
  deleteTempEventProperties, updateParticipantHideProperty, sortHiddenAttendees,
  getModalStyle, showModal, hideModal, attachEventListeners, removeModalEventListeners,
} from './utilities.js';

const cloneDeep = require('lodash.clonedeep');

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
    id, creator, start, end,
    created = new Date(),
    updated = new Date(),
    summary = 'New Event',
    description = 'New event description',
    color = '#2e84d5',
    attendees = CalendarEvent.defaultAttendees(),
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
    if (!this.attendeesClone) this.attendeesClone = cloneDeep(this.attendees);
    updateParticipantHideProperty(this.attendeesClone, participantID);
    sortHiddenAttendees(this.attendeesClone);
    updateEventParticipantsAttendance(this, true);
    return getParticipantsHTML(this.attendeesClone);
  }

  modifyEvent() {
    updateEventProperties(this);
    deleteTempEventProperties(this);
    this.relatedCalendar.modifyEvent(this);
  }

  handleModal(event) {
    if (event.type === 'keydown' && event.key !== 'Escape') return;
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
      $participants.innerHTML = this.addParticipant(isNewParticipant);
    } else if (isSave) {
      if (this.attendeesClone) this.attendees = this.attendeesClone;
      this.modifyEvent();
      hideModal($eventButton, $modalOuter);
      removeModalEventListeners(this.handleModal, $modalOuter, $participants);
    } else if (isDelete) {
      this.deleteEvent(this.relatedCalendar);
      hideModal($eventButton, $modalOuter);
      removeModalEventListeners(this.handleModal, $modalOuter, $participants);
    } else if (isCloseBtn || isOutside || isEscape) {
      hideModal($eventButton, $modalOuter);
      removeModalEventListeners(this.handleModal, $modalOuter, $participants);
    }
  }

  showEvent($eventButton) {
    const $modalOuter = document.querySelector('.modal-outer');
    const style = getModalStyle($eventButton, this.color);
    const isDarkFont = isDark(this.color);
    const pattern = 'yyyy-MM-dd\'T\'HH:mm';
    const participantsHTML = getParticipantsHTML(this.attendees);
    const eventWindowHTML = `
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
    showModal($eventButton, $modalOuter, eventWindowHTML);
    this.handleModal = this.handleModal.bind(this);
    attachEventListeners($modalOuter, this);
  }
}
