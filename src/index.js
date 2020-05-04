import test from '../data/index.js';
import ManageUser from './ManageUser.js';
import Weekly, { autoScroll } from './Weekly.js';
import CalendarEvent from './CalendarEvent.js';
import { changeDate } from './utilities.js';

// EMULA LA RESPUESTA DE LA API CON LOS USUARIOS EXISTENTES

function start(calendar, users) {
  calendar.showTopBar();
  calendar.showCalendar();
  calendar.showEvents();
  if (new Date().getHours() > 9) autoScroll();
  const marcelo = new ManageUser(users);
  marcelo.showUsers();
}

const date = new Date('2020-04-26T19:03:52.214Z');
const events = test.map((event) => new CalendarEvent(event));
const weekly = new Weekly('Test', events, true, date);
const users = [
  {
    id: 1,
    email: 'test@test.com',
    displayName: 'Test',
    self: true,
  },
  {
    id: 2,
    email: 'test2@test.com',
    displayName: 'Test2',
    self: null,
  },
  {
    id: 3,
    email: 'test3@test.com',
    displayName: 'Test3',
    self: null,
  },
];

start(weekly, users);
