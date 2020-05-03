export default class Calendar {
  constructor(owner, events, showWeekends) {
    this.owner = owner;
    this.events = events.sort((a, b) => a.start.getTime() - b.start.getTime());
    this.showWeekends = showWeekends;
  }
}
