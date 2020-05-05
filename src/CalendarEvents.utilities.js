export default function getParticipantsHTML(attendees) {
  const newParticipants = [];
  let newParticipantsHTML;

  const attendeesHTML = attendees.map((attendee) => {
    const isCreator = `${attendee.organizer ? '(creator)' : ''}`;
    const isSelf = `${attendee.self ? '(you)' : ''}`;
    const attendance = `
      <option${attendee.responseStatus === true ? ' selected' : ''}>Going</option>
      <option${attendee.responseStatus === false ? ' selected' : ''}>Not going</option>
      <option${attendee.responseStatus === null ? ' selected' : ''}>Not confirmed</option>`;
    if (attendee.hide === true) {
      newParticipants.push(attendee);
      return '';
    }
    return `
      <li class="d-flex justify-content-between">
        <span>${attendee.displayName} ${isCreator} ${isSelf}</span>
        <select id="attendance">${attendance}</select>
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
