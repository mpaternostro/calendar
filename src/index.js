import test from '../data/index.js';
import ManageUser from './ManageUser.js';
import Weekly, { autoScroll } from './Weekly.js';
import Event from './Event.js';

// EMULA LA RESPUESTA DE LA API CON LOS USUARIOS EXISTENTES
const users = [
  {
    id: 1,
    email: 'marcelo@gmail.com',
    displayName: 'Marcelo',
    self: null,
  },
  {
    id: 2,
    email: 'valen@gmail.com',
    displayName: 'Valen',
    self: null,
  },
  {
    id: 3,
    email: 'gaby@gmail.com',
    displayName: 'Gaby',
    self: null,
  },
];

const date = new Date('2020-04-26T19:03:52.214Z');
const events = test.map((event) => new Event(event));
const weekly = new Weekly('Marcelo', events, true, date);
weekly.showTopBar();
weekly.showCalendar();
weekly.showEvents();
if (new Date().getHours() > 9) autoScroll();

const marcelo = new ManageUser(users);
marcelo.showUsers();
