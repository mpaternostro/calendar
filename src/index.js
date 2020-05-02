import test from '../data/index.js';
import ManageUser from './ManageUser.js';
import Weekly, { autoScroll } from './Weekly.js';

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


// const dates = [
//   new Date(2020, 3, 28),
//   new Date(2020, 3, 29),
//   new Date(2020, 3, 30),
//   new Date(2020, 3, 31),
//   new Date(2020, 4, 1),
//   new Date(2020, 4, 2),
//   new Date(2020, 4, 3),
// ];

const date = new Date('2020-04-26T19:03:52.214Z');
// const dates = '28 mar - 3 apr';
const events = [test];

const weekly = new Weekly('Marcelo', events, true, date);
weekly.showTopBar();
weekly.showCalendar();
weekly.showEvents();
autoScroll();

const marcelo = new ManageUser(users);
marcelo.showUsers();
