import test from '../data/index.js';
import ManageUser from './ManageUser.js';
import Weekly from './Weekly.js';

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

const dates = '28 mar - 3 apr';
const events = [test];

const weekly = new Weekly('Marcelo', events, true, dates);
weekly.showTopBar();
weekly.showCalendar();
weekly.showEvents();

const marcelo = new ManageUser(users);
marcelo.showUsers();
