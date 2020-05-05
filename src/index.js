import ManageUser from './ManageUser.js';
import Weekly, { autoScroll } from './Weekly.js';
import CalendarEvent from './CalendarEvent.js';

async function start() {
  const endpoint = '../data/index-modif.json';
  const data = await (await fetch(endpoint)).json();
  const date = new Date('2020-04-26T19:03:52.214Z');
  const events = data.map((event) => new CalendarEvent(event));
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

  weekly.showTopBar();
  weekly.showCalendar();
  weekly.showEvents();
  if (new Date().getHours() > 9) autoScroll();
  const marcelo = new ManageUser(users);
  marcelo.showUsers();
}


start();
