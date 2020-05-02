export default class Calendar {
  constructor(owner, [events], showWeekends) {
    this.owner = owner;
    this.events = events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    this.showWeekends = showWeekends;
  }
}
