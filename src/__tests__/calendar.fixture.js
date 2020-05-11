export default `
<div id="manage-user-modal" class="modal d-block" tabindex="-1" role="dialog" data-show="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">User selection</h5>
      </div>
      <select class="modal-body users" size="3">
      </select>
      <div class="modal-footer">
        <button id="close-user-list" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="select-user" type="button" class="btn btn-primary">Select</button>
      </div>
    </div>
  </div>
</div>
<div class="d-flex flex-column p-1 bd-highlight">
  <div id="top-bar" class="mb-1 p-1 border-bottom rounded header-color">
  <div class="row text-center align-items-center m-1">
    <ul class="pagination col-4 m-0 pl-5">
      <li id="previous-button" data-keyword="backward" class="page-item"><a class="page-link" href="#">Previous</a></li>
      <li id="today-button" data-keyword="today" class="page-item"><a class="page-link show-week pl-2 pr-2" href="#">26 Apr - 02 May</a></li>
      <li id="next-button" data-keyword="forward" class="page-item"><a class="page-link" href="#">Next</a></li>
    </ul>
    <div class="col-4" style="font-size: 24px">
      Calendar
    </div>
    <button class="col-2 border border-primary rounded view">
      View: Weekly
    </button>
    <div id="manage-user" class="col-2 pl-5">
      <button type="button" class="btn btn-primary" data-active-user="test">
        Test
      </button>
    </div>
  </div></div>
    <table id="calendar">
  <div class="week week-days border-bottom">
    <div class="" scope="col"></div>
    <h5 class="day border-right" scope="col">Sunday 26</h5>
    <h5 class="day border-right" scope="col">Monday 27</h5>
    <h5 class="day border-right" scope="col">Tuesday 28</h5>
    <h5 class="day border-right" scope="col">Wednesday 29</h5>
    <h5 class="day border-right" scope="col">Thursday 30</h5>
    <h5 class="day border-right" scope="col">Friday 01</h5>
    <h5 class="day border-right" scope="col">Saturday 02</h5>
  </div>
  <div class="week border-bottom">
    <span scope="col" class="timezone">GMT -3</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">1 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">1 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">0 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">0 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">0 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">0 events</span>
    <span class="events-qty mb-1 mt-1 border-right" scope="col">0 events</span>
  </div>
  <div class="week-data pt-3">
    <div class="modal-outer"></div>
    <div class="timetable">
      
  <div class="times pr-1" data-hour="0">
    <span class="elevate">0.00</span>
  </div>
  <div class="times pr-1" data-hour="1">
    <span class="elevate">1.00</span>
  </div>
  <div class="times pr-1" data-hour="2">
    <span class="elevate">2.00</span>
  </div>
  <div class="times pr-1" data-hour="3">
    <span class="elevate">3.00</span>
  </div>
  <div class="times pr-1" data-hour="4">
    <span class="elevate">4.00</span>
  </div>
  <div class="times pr-1" data-hour="5">
    <span class="elevate">5.00</span>
  </div>
  <div class="times pr-1" data-hour="6">
    <span class="elevate">6.00</span>
  </div>
  <div class="times pr-1" data-hour="7">
    <span class="elevate">7.00</span>
  </div>
  <div class="times pr-1" data-hour="8">
    <span class="elevate">8.00</span>
  </div>
  <div class="times pr-1" data-hour="9">
    <span class="elevate">9.00</span>
  </div>
  <div class="times pr-1" data-hour="10">
    <span class="elevate">10.00</span>
  </div>
  <div class="times pr-1" data-hour="11">
    <span class="elevate">11.00</span>
  </div>
  <div class="times pr-1" data-hour="12">
    <span class="elevate">12.00</span>
  </div>
  <div class="times pr-1" data-hour="13">
    <span class="elevate">13.00</span>
  </div>
  <div class="times pr-1" data-hour="14">
    <span class="elevate">14.00</span>
  </div>
  <div class="times pr-1" data-hour="15">
    <span class="elevate">15.00</span>
  </div>
  <div class="times pr-1" data-hour="16">
    <span class="elevate">16.00</span>
  </div>
  <div class="times pr-1" data-hour="17">
    <span class="elevate">17.00</span>
  </div>
  <div class="times pr-1" data-hour="18">
    <span class="elevate">18.00</span>
  </div>
  <div class="times pr-1" data-hour="19">
    <span class="elevate">19.00</span>
  </div>
  <div class="times pr-1" data-hour="20">
    <span class="elevate">20.00</span>
  </div>
  <div class="times pr-1" data-hour="21">
    <span class="elevate">21.00</span>
  </div>
  <div class="times pr-1" data-hour="22">
    <span class="elevate">22.00</span>
  </div>
  <div class="times pr-1" data-hour="23">
    <span class="elevate">23.00</span>
  </div>
    </div>
    <div class="gridY" data-day="26" data-month="3" data-year="2020">
  <button style="" class="event ml-1" data-event-position="0" data-event-id="1">
    <div class="event-summary m-0">Evento 1</div>
    <div class="event-info" style="">
      19:43 - 20:43
    </div>
  </button></div>
    <div class="gridY" data-day="27" data-month="3" data-year="2020">
  <button style="" class="event ml-1" data-event-position="0" data-event-id="2">
    <div class="event-summary m-0">Evento 2</div>
    <div class="event-info" style="">
      19:43 - 20:43
    </div>
  </button></div>
    <div class="gridY" data-day="28" data-month="3" data-year="2020"></div>
    <div class="gridY" data-day="29" data-month="3" data-year="2020"></div>
    <div class="gridY" data-day="30" data-month="3" data-year="2020"></div>
    <div class="gridY" data-day="01" data-month="4" data-year="2020"></div>
    <div class="gridY" data-day="02" data-month="4" data-year="2020"></div>
  </div></table>
</div>`;
