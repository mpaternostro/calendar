// eslint-disable-next-line spaced-comment
/// <reference types="Jest" />

import CalendarEvent from '../CalendarEvent.js';
import Weekly from '../../calendar/weekly/Weekly.js';
import eventData from './CalendarEvent.fixture.js';
import { addTest3, addTest2 } from './newParticipants.fixture.js';
import eventsData from './events.fixture.js';
import eventModal from './eventModal.fixture.js';
import eventHTML from './eventHTML.fixture.js';
import {
  eventOneHTML, eventTwoHTML, eventThreeHTML, addParticipantTwoHTML,
} from './shownEvent.fixture.js';

const cloneDeep = require('lodash.clonedeep');

function deleteWhitespaces(html) {
  return html.replace(/\s+/g, '');
}

test('agrega un nuevo participante al evento', () => {
  const event = new CalendarEvent({ eventData });
  expect(deleteWhitespaces(event.addParticipant(3))).toMatch(deleteWhitespaces(addTest3));
  expect(deleteWhitespaces(event.addParticipant(2))).toMatch(deleteWhitespaces(addTest2));
});

describe('llama métodos del calendario', () => {
  const event = new CalendarEvent(eventData);
  const calendar = new Weekly('Test1', [eventsData], true, new Date());
  event.relatedCalendar = calendar;

  test('llama al método de weekly que borra el evento del calendario', () => {
    event.relatedCalendar.deleteEvent = jest.fn();
    event.deleteEvent();
    expect(event.relatedCalendar.deleteEvent).toHaveBeenCalledTimes(1);
    expect(event.relatedCalendar.deleteEvent).toHaveBeenCalledWith(event);
  });

  test('llama al método de weekly que modifica el evento del calendario', () => {
    const now = Date.now();
    const spy = jest.spyOn(global.Date, 'now').mockImplementation(() => now);
    document.body.innerHTML = eventModal;
    event.relatedCalendar.modifyEvent = jest.fn();

    const modifiedEvent = cloneDeep(event);
    modifiedEvent.summary = 'Test';
    modifiedEvent.description = 'Fixture';
    modifiedEvent.color = '#2e84d5';
    modifiedEvent.attendees[0].responseStatus = true;
    modifiedEvent.attendees[1].responseStatus = false;
    modifiedEvent.attendees[2].responseStatus = null;
    modifiedEvent.start = new Date('2020-04-30T17:00:00.000Z');
    modifiedEvent.end = new Date('2020-04-30T20:00:00.000Z');
    modifiedEvent.updated = new Date(now);

    event.modifyEvent();
    expect(event.relatedCalendar.modifyEvent).toHaveBeenCalledTimes(1);
    expect(event.relatedCalendar.modifyEvent).toHaveBeenCalledWith(event);
    expect(modifiedEvent).toEqual(event);

    event.start = new Date(eventData.start);
    event.end = new Date(eventData.end);
    modifiedEvent.start = new Date(eventData.start);
    modifiedEvent.end = new Date(eventData.end);
    document.querySelector('[name="start"]').value = '2020-04-30T19:00';
    event.modifyEvent();
    expect(modifiedEvent).toEqual(event);
    spy.mockRestore();
  });
});


describe('muestra el evento en pantalla', () => {
  beforeEach(() => {
    document.body.innerHTML = eventHTML;
  });
  test('agrega un participante al evento', () => {
    const event = new CalendarEvent(eventsData[2]);
    const resultHTML = event.addParticipant(2);
    expect(deleteWhitespaces(resultHTML)).toEqual(deleteWhitespaces(addParticipantTwoHTML));
  });

  test('muestra el evento 1 en pantalla', () => {
    const event = new CalendarEvent(eventsData[0]);
    const $eventButton = document.querySelector('button');
    event.showEvent($eventButton);
    const $event = document.querySelector('.event-window');

    expect(deleteWhitespaces($event.innerHTML)).toEqual(deleteWhitespaces(eventOneHTML));
  });

  test('muestra el evento 2 en pantalla', () => {
    const event = new CalendarEvent(eventsData[1]);
    const $eventButton = document.querySelector('button');
    event.showEvent($eventButton);
    const $event = document.querySelector('.event-window');

    expect(deleteWhitespaces($event.innerHTML)).toEqual(deleteWhitespaces(eventTwoHTML));
  });

  test('muestra el evento 3 en pantalla', () => {
    const event = new CalendarEvent(eventsData[2]);
    const $eventButton = document.querySelector('button');
    event.showEvent($eventButton);
    const $event = document.querySelector('.event-window');

    expect(deleteWhitespaces($event.innerHTML)).toEqual(deleteWhitespaces(eventThreeHTML));
  });
});

describe('determina que pasa con el evento segun el boton clickeado', () => {
  const event = new CalendarEvent(eventData);
  const modalOuter = document.createElement('div');
  modalOuter.setAttribute('class', 'modal-outer');
  const eventEl = document.createElement('div');
  eventEl.setAttribute('class', 'event open');
  const saveButton = document.createElement('button');
  saveButton.setAttribute('id', 'save-button');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('id', 'close-button');
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('id', 'delete-button');
  const participants = document.createElement('div');
  participants.setAttribute('class', 'participants');
  const select = document.createElement('select');
  document.body.append(modalOuter, eventEl, saveButton, closeButton);
  document.body.append(deleteButton, participants, select);
  const option = document.createElement('option');
  option.dataset.userId = '3';
  select.appendChild(option);

  test('simula añadir un participante', () => {
    event.addParticipant = jest.fn();
    const change = { type: 'change', target: select };
    event.handleModal(change);
    const optionUserID = Number(change.target.selectedOptions[0].dataset.userId);
    expect(event.addParticipant).toHaveBeenCalledTimes(1);
    expect(event.addParticipant).toHaveBeenCalledWith(optionUserID);
  });

  test('simula click en "Save"', () => {
    event.modifyEvent = jest.fn();
    const mousedown = { type: 'mousedown', target: saveButton };
    event.handleModal(mousedown);
    expect(event.modifyEvent).toHaveBeenCalledTimes(1);
  });

  test('simula click en "Save" tras haber agregado un nuevo participante', () => {
    document.body.append(participants, eventEl);
    event.modifyEvent = jest.fn();
    event.attendeesClone = cloneDeep(event.attendees);
    const mousedown = { type: 'mousedown', target: saveButton };
    event.handleModal(mousedown);
    expect(event.modifyEvent).toHaveBeenCalledTimes(1);
  });

  test('simula click en "Delete"', () => {
    event.deleteEvent = jest.fn();
    participants.setAttribute('class', 'participants');
    eventEl.setAttribute('class', 'event open');
    document.body.append(participants, eventEl);
    const mousedown = { type: 'mousedown', target: deleteButton };
    event.handleModal(mousedown);
    expect(event.deleteEvent).toHaveBeenCalledTimes(1);
    expect(event.deleteEvent).toHaveBeenCalledWith(event.relatedCalendar);
  });
});
