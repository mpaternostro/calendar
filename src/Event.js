import { format } from 'date-fns';
import { widthPxToPc, isDark } from './utilities.js';

export default class Event {
  constructor({
    id, created, updated, summary, description, color, creator, start, end, attendees,
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

  showEvent(clickEvent) {
    const $calendar = document.querySelector('#calendar');
    const $modalOuter = document.querySelector('.modal-outer');
    const $eventButton = clickEvent.currentTarget;

    function handleModal(event) {
      const $closeButton = document.querySelector('#close-button');
      let isOutside;
      let isCloseBtn;
      let isEscape;
      if (event.type === 'click') {
        isCloseBtn = event.target === $closeButton;
        isOutside = !event.target.closest('.event-window');
      } else if (event.key === 'Escape') {
        isEscape = true;
      }
      if (isCloseBtn || isOutside || isEscape) {
        $eventButton.classList.remove('open');
        $modalOuter.classList.remove('open');
        $modalOuter.innerHTML = '';
        $modalOuter.removeEventListener('click', handleModal);
        window.removeEventListener('keydown', handleModal);
      }
    }

    const eventWindowPlacement = {
      x: ($eventButton.getBoundingClientRect().left / window.innerWidth) * 100,
      y: ($eventButton.getBoundingClientRect().top / window.innerHeight) * 100,
    };
    const eventButtonWidth = widthPxToPc($eventButton.offsetWidth, $calendar);

    const isDarkFont = isDark(this.color);
    const style = `
    min-height: 25%;
    background-color: ${this.color};
    left: ${eventWindowPlacement.x > 60
    ? eventWindowPlacement.x - eventButtonWidth - 35
    : eventWindowPlacement.x + eventButtonWidth + 2}%;
    top: ${eventWindowPlacement.y > 60 ? eventWindowPlacement.y - 15 : eventWindowPlacement.y}%;`;

    const attendees = this.attendees.map((attendee) => {
      const isCreator = `${attendee.organizer ? '(creator)' : ''}`;
      const isSelf = `${attendee.self ? '(you)' : ''}`;
      return `<li>${attendee.displayName} ${isCreator} ${isSelf}</li>`;
    }).join('');

    const eventWindow = `
      <div style="${style}" class="event-window ${isDarkFont ? 'dark' : ''}" >
        <div class="event-data">
          <div class="general">
            <input id="summary" value="${this.summary}" ${isDarkFont ? 'class= "dark"' : ''}></input>
            <input id="description" value="${this.description}" ${isDarkFont ? 'class= "dark"' : ''}></input>
            <div class="start-end-time">
              <label>Start Time: <input class="event-time ${isDarkFont ? 'dark' : ''}" type="time" value="${format(this.start, 'HH:mm')}"></input></label>
              <label>End Time: 
                <input class="event-time ${isDarkFont ? 'dark' : ''}" type="time" value="${format(this.end, 'HH:mm')}"></input>
              </label>
            </div>
            <span class="event-time">Updated: ${this.updated}</span>
            <span class="event-time">Created: ${this.created}</span>
          </div>
          <div class="participants">
            <ul id="attendees" class="p-4">Participants
              ${attendees}
            </ul>
          </div>
        </div>
        <div class="event-buttons">
          <div><button id="save-button" class="event-action-button ${isDarkFont ? 'dark' : ''}">Save</button></div>
          <div><button id="close-button" class="event-action-button ${isDarkFont ? 'dark' : ''}">Close</button></div>
        </div>
      </div>`;

    $eventButton.classList.add('open');
    $modalOuter.classList.add('open');
    $modalOuter.innerHTML = eventWindow;

    $modalOuter.addEventListener('click', handleModal);
    window.addEventListener('keydown', handleModal);
  }
}
