import { widthPxToPc } from '../../utilities/utilities.js';

export function getParticipantsHTML(attendees) {
  const newParticipants = [];
  let newParticipantsHTML;

  const attendeesHTML = attendees.map((attendee) => {
    const isCreator = `${attendee.organizer ? ' (creator)' : ''}`;
    const isSelf = `${attendee.self ? ' (you)' : ''}`;
    const attendance = `
      <option data-attendance="true"${attendee.responseStatus === true ? ' selected' : ''}>Going</option>
      <option data-attendance="false"${attendee.responseStatus === false ? ' selected' : ''}>Not going</option>
      <option data-attendance="null"${attendee.responseStatus === null ? ' selected' : ''}>Not confirmed</option>`;
    if (attendee.hide === true) {
      newParticipants.push(attendee);
      return '';
    }
    return `
      <li class="d-flex justify-content-between">
        <span>${attendee.displayName}${isCreator}${isSelf}</span>
        <select class="attendance">${attendance}</select>
      </li>`;
  }).join('');

  if (newParticipants.length !== 0) {
    newParticipantsHTML = `
    <select>Add:
      <option>Select a new participant</option>
      <option data-user-id="${newParticipants[0].id}">${newParticipants[0].displayName}</option>
      ${newParticipants[1] ? `<option data-user-id="${newParticipants[1].id}">${newParticipants[1].displayName}</option>` : ''}
    </select>`;
  }

  return `
    <ul id="attendees" class="p-3">Participants
      ${attendeesHTML}
    </ul>
    ${newParticipantsHTML
    ? `<div id="new-participants" class="p-3">Add:
        ${newParticipantsHTML}
       </div>`
    : ''}`;
}

export function updateParticipantHideProperty(attendeesClone, participantID) {
  const participant = attendeesClone.find((attendee) => attendee.id === participantID);
  participant.hide = false;
}

export function sortHiddenAttendees(attendeesClone) {
  attendeesClone.sort((a, b) => {
    if (a.hide === true) {
      return 0;
    }
    if (b.hide === true) {
      return -1;
    }
    return 0;
  });
}

function updateEventSummaryAndDescription(event) {
  const $modal = document.querySelector('.event-window');
  const $inputsText = $modal.querySelectorAll('input[type="text"]');
  $inputsText.forEach((input) => {
    event[input.id] = input.value;
  });
}

function updateEventColor(event, $modal) {
  const $inputColor = $modal.querySelector('input[type="color"]');
  event.color = $inputColor.value;
}

function updateEventStartAndEndTime(event, $modal) {
  const $inputsDate = $modal.querySelectorAll('input[type="datetime-local"]');
  if (new Date($inputsDate[0].value).getTime() > new Date($inputsDate[1].value).getTime()) return;
  $inputsDate.forEach((input) => {
    event[input.name] = new Date(input.value);
  });
}

export function updateEventParticipantsAttendance(event, clone = false) {
  const $attendance = Array.from(document.querySelectorAll('.attendance'));
  $attendance.forEach((select, index) => {
    const attendee = (clone === false ? event.attendees[index] : event.attendeesClone[index]);
    const { attendance } = select.selectedOptions[0].dataset;
    if (attendance === 'true') attendee.responseStatus = true;
    if (attendance === 'false') attendee.responseStatus = false;
    if (attendance === 'null') attendee.responseStatus = null;
  });
}

function editEventUpdatedTime(event) {
  event.updated = new Date(Date.now());
}

export function updateEventProperties(event) {
  const $general = document.querySelector('.general');

  updateEventSummaryAndDescription(event);
  updateEventColor(event, $general);
  updateEventStartAndEndTime(event, $general);
  updateEventParticipantsAttendance(event);
  editEventUpdatedTime(event);
}

export function deleteTempEventProperties(event) {
  delete event.newStart;
  delete event.newEnd;
  delete event.attendeesClone;
}

export function getModalStyle($eventButton, eventColor) {
  const $calendar = document.querySelector('#calendar');
  const eventWindowPlacement = {
    x: ($eventButton.getBoundingClientRect().left / window.innerWidth) * 100,
    y: ($eventButton.getBoundingClientRect().top / window.innerHeight) * 100,
  };
  const eventButtonWidth = widthPxToPc($eventButton.offsetWidth, $calendar);

  const style = `
  min-height: 25%;
  background-color: ${eventColor};
  left: ${eventWindowPlacement.x > 45
    ? eventWindowPlacement.x - eventButtonWidth - 25
    : eventWindowPlacement.x + eventButtonWidth + 2}%;
  top: ${eventWindowPlacement.y > 55 ? eventWindowPlacement.y - 40 : eventWindowPlacement.y + 5}%;`;
  return style;
}

export function showModal($eventButton, $modalOuter, eventWindowHTML) {
  $eventButton.classList.add('open');
  $modalOuter.classList.add('open');
  $modalOuter.innerHTML = eventWindowHTML;
}

export function hideModal($eventButton, $modalOuter) {
  $eventButton.classList.remove('open');
  $modalOuter.classList.remove('open');
  $modalOuter.innerHTML = '';
}

export function attachEventListeners($modalOuter, event) {
  $modalOuter.addEventListener('mousedown', event.handleModal);
  window.addEventListener('keydown', event.handleModal);
  if (event.attendees.filter((attendee) => attendee.hide === true).length > 0) {
    const $participants = document.querySelector('.participants');
    $participants.addEventListener('change', event.handleModal);
  }
}

export function removeModalEventListeners(handleModal, $modalOuter, $participants) {
  $modalOuter.removeEventListener('mousedown', handleModal);
  window.removeEventListener('keydown', handleModal);
  $participants.removeEventListener('change', handleModal);
}
