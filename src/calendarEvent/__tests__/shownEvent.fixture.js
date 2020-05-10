export const eventOneHTML = `
    <div class="event-data">
      <div class="general">
        <div class="d-flex">
          <input id="summary" type="text" value="Evento 1">
          <label class="m-0">Color: <input type="color" value="#dec5ac"></label>
        </div>
        <input id="description" type="text" value="Descripción prolongada del evento 1">
        <div class="start-end-time">
          <label>From: 
            <input name="start" class="event-time " type="datetime-local" value="2020-04-26T19:43">
          </label>
          <label>To: 
            <input name="end" class="event-time " type="datetime-local" value="2020-04-26T20:43">
          </label>
        </div>
        <span class="event-time">Updated: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
        <span class="event-time">Created: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
      </div>
      <div class="participants">
        
<ul id="attendees" class="p-3">Participants
  
  <li class="d-flex justify-content-between">
    <span>Test Test (creator) (you)</span>
    <select class="attendance">
  <option data-attendance="true" selected="">Going</option>
  <option data-attendance="false">Not going</option>
  <option data-attendance="null">Not confirmed</option></select>
  </li>
  <li class="d-flex justify-content-between">
    <span>Test2 Test</span>
    <select class="attendance">
  <option data-attendance="true">Going</option>
  <option data-attendance="false" selected="">Not going</option>
  <option data-attendance="null">Not confirmed</option></select>
  </li>
  <li class="d-flex justify-content-between">
    <span>Test3 Test</span>
    <select class="attendance">
  <option data-attendance="true">Going</option>
  <option data-attendance="false">Not going</option>
  <option data-attendance="null" selected="">Not confirmed</option></select>
  </li>
</ul>

      </div>
    </div>
    <div class="event-buttons">
      <div><button id="save-button" class="btn btn-primary event-action-button ">Save</button></div>
      <div><button id="close-button" class="btn btn-secondary event-action-button ">Close</button></div>
      <div><button id="delete-button" class="btn btn-danger event-action-button ">Delete</button></div>
    </div>`;

export const eventTwoHTML = `<div class="event-data">
        <div class="general">
          <div class="d-flex">
            <input id="summary" type="text" value="Evento 2" class="dark">
            <label class="m-0">Color: <input type="color" value="#000000"></label>
          </div>
          <input id="description" type="text" value="Descripción prolongada del evento 2" class="dark">
          <div class="start-end-time">
            <label>From: 
              <input name="start" class="event-time dark" type="datetime-local" value="2020-04-27T19:43">
            </label>
            <label>To: 
              <input name="end" class="event-time dark" type="datetime-local" value="2020-04-27T20:43">
            </label>
          </div>
          <span class="event-time">Updated: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
          <span class="event-time">Created: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
        </div>
        <div class="participants">
          
  <ul id="attendees" class="p-3">Participants
    
    <li class="d-flex justify-content-between">
      <span>Test Test</span>
      <select class="attendance">
    <option data-attendance="true" selected="">Going</option>
    <option data-attendance="false">Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
    <li class="d-flex justify-content-between">
      <span>Test2 Test (creator)</span>
      <select class="attendance">
    <option data-attendance="true" selected="">Going</option>
    <option data-attendance="false">Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
    <li class="d-flex justify-content-between">
      <span>Test3 Test</span>
      <select class="attendance">
    <option data-attendance="true">Going</option>
    <option data-attendance="false" selected="">Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
  </ul>
  
        </div>
      </div>
      <div class="event-buttons">
        <div><button id="save-button" class="btn btn-primary event-action-button dark">Save</button></div>
        <div><button id="close-button" class="btn btn-secondary event-action-button dark">Close</button></div>
        <div><button id="delete-button" class="btn btn-danger event-action-button dark">Delete</button></div>
      </div>`;

export const eventThreeHTML = `<div class="event-data">
<div class="general">
  <div class="d-flex">
    <input id="summary" type="text" value="Evento 2" class="dark">
    <label class="m-0">Color: <input type="color" value="#000000"></label>
  </div>
  <input id="description" type="text" value="Descripción prolongada del evento 2" class="dark">
  <div class="start-end-time">
    <label>From: 
      <input name="start" class="event-time dark" type="datetime-local" value="2020-04-27T19:43">
    </label>
    <label>To: 
      <input name="end" class="event-time dark" type="datetime-local" value="2020-04-27T20:43">
    </label>
  </div>
  <span class="event-time">Updated: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
  <span class="event-time">Created: Sun Apr 26 2020 19:39:50 GMT-0300 (Argentina Standard Time)</span>
</div>
<div class="participants">
          
  <ul id="attendees" class="p-3">Participants
    
    <li class="d-flex justify-content-between">
      <span>Test Test (creator) (you)</span>
      <select class="attendance">
    <option data-attendance="true" selected="">Going</option>
    <option data-attendance="false">Not going</option>
    <option data-attendance="null">Not confirmed</option></select>
    </li>
  </ul>
  <div id="new-participants" class="p-3">Add:
      
  <select>Add:
    <option>Select a new participant</option>
    <option data-user-id="2">Test2 Test</option>
    <option data-user-id="3">Test3 Test</option>
  </select>
     </div>
        </div>
      </div>
      <div class="event-buttons">
        <div><button id="save-button" class="btn btn-primary event-action-button dark">Save</button></div>
        <div><button id="close-button" class="btn btn-secondary event-action-button dark">Close</button></div>
        <div><button id="delete-button" class="btn btn-danger event-action-button dark">Delete</button></div>
      </div>`;

export const addParticipantTwoHTML = `
<ul id="attendees" class="p-3">Participants    
  <li class="d-flex justify-content-between">
    <span>Test Test (creator) (you)</span>
    <select class="attendance">
  <option data-attendance="true" selected>Going</option>
  <option data-attendance="false">Not going</option>
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
<div id="new-participants" class="p-3">Add:      
  <select>Add:
    <option>Select a new participant</option>
    <option data-user-id="3">Test3 Test</option>
  </select>
</div>`;
