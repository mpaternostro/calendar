export default class Calendar {
  constructor(owner, [events], showWeekends) {
    this.owner = owner;
    this.events = events;
    this.showWeekends = showWeekends;
  }

  getEventTimes(event) {
    this.start = `${new Date(event.start).getHours()}:${new Date(event.start).getMinutes()}`;
    this.end = `${new Date(event.end).getHours()}:${new Date(event.end).getMinutes()}`;
    this.startHour = new Date(event.start).getHours();
    this.startMinutes = new Date(event.start).getMinutes();
    this.endHour = new Date(event.end).getHours();
    this.endMinutes = new Date(event.end).getMinutes();
    this.duration = (new Date(event.end).getTime() - new Date(event.start).getTime());
    this.durationMinutes = this.duration / 1000 / 60;
    return `${this.start} - ${this.end}`;
  }

  // getEventInfo() {
  //   this.startHour = new this.start.getHours();
  // this.startMinutes =
  // this.endHour =
  // this.endMinutes =
  // }
}
