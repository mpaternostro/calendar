export default function sortEvents(events) {
  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}
