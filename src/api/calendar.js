export default async function getCalendarEvents() {
  const endpoint = '../data/index.json';
  return (await fetch(endpoint)).json();
}
