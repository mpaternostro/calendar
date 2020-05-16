import sortEvents from './utilities.js';

export default class Calendar {
  constructor(owner, events, showWeekends) {
    this.owner = owner;
    this.events = sortEvents(events);
    this.showWeekends = showWeekends;
  }
}
