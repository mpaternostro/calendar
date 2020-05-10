export default `
<div style="
min-height: 25%;
background-color: #2e84d5;
left: 22.751948479442746%;
top: 45.36061026352289%;" class="event-window dark">
      <div class="event-data">
        <div class="general">
          <div class="d-flex">
            <input id="summary" type="text" value="Test" class="dark">
            <label class="m-0">Color: <input type="color" value="#2e84d5"></label>
          </div>
          <input id="description" type="text" value="Fixture" class="dark">
          <div class="start-end-time">
            <label>From: 
              <input name="start" class="event-time dark" type="datetime-local" value="2020-04-30T14:00">
            </label>
            <label>To: 
              <input name="end" class="event-time dark" type="datetime-local" value="2020-04-30T17:00">
            </label>
          </div>
          <span class="event-time">Updated: Fri May 08 2020 21:56:45 GMT-0300 (Argentina Standard Time)</span>
          <span class="event-time">Created: Fri May 08 2020 21:55:33 GMT-0300 (Argentina Standard Time)</span>
        </div>
        <div class="participants">
          
  <ul id="attendees" class="p-3">Participants
    
    <li class="d-flex justify-content-between">
      <span>Test Test (creator) (you)</span>
      <select class="attendance">
    <option data-attendance="true" selected>Going</option>
    <option data-attendance="false">Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
    <li class="d-flex justify-content-between">
      <span>Test3 Test</span>
      <select class="attendance">
    <option data-attendance="true">Going</option>
    <option data-attendance="false" selected>Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
    <li class="d-flex justify-content-between">
      <span>Test2 Test</span>
      <select class="attendance">
    <option data-attendance="true">Going</option>
    <option data-attendance="false">Not going</option>
    <option data-attendance="null" selected>Not confirmed</option></select>
    </li>
  </ul>
  
        </div>
      </div>
      <div class="event-buttons">
        <div><button id="save-button" class="btn btn-primary event-action-button dark">Save</button></div>
        <div><button id="close-button" class="btn btn-secondary event-action-button dark">Close</button></div>
        <div><button id="delete-button" class="btn btn-danger event-action-button dark">Delete</button></div>
      </div>
    </div>`;
