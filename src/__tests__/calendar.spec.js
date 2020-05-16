// eslint-disable-next-line spaced-comment
/// <reference types="Jest" />

import start from '../calendar.js';
import calendarHTML from './calendar.fixture.js';
import events from '../../data/index.json';

function deleteWhitespaces(html) {
  return html.replace(/\s+/g, '');
}

test('inicializa calendario semanal', async () => {
  document.body.innerHTML = `
  <div class="d-flex flex-column p-1 bd-highlight">
    <div id="top-bar" class="mb-1 p-1 border-bottom rounded header-color">
      <!-- TOP BAR -->
    </div>
    <table id="calendar">
      <!-- CALENDAR -->
    </table>
  </div>`;

  global.fetch = jest.fn()
    .mockImplementation(() => new Promise((resolve) => {
      const jsonPromise = new Promise((r) => {
        r(events);
      });
      resolve({ json: () => jsonPromise });
    }));
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  await start();
  const $events = document.querySelectorAll('.event');
  $events.forEach((event) => {
    event.style = '';
  });

  const $eventsInfoStyle = document.querySelectorAll('.event-info');
  $eventsInfoStyle.forEach((event) => {
    event.style = '';
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(deleteWhitespaces(document.body.innerHTML)).toEqual(deleteWhitespaces(calendarHTML));
  if (new Date().getHours() > 9) expect(scrollIntoViewMock).toBeCalled();
});
