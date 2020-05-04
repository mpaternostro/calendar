export default class ManageUser {
  constructor(users) {
    this.users = [...users];
  }

  showUsers() {
    function handleModal(event) {
      const $closeButton = document.querySelector('[data-dismiss="modal"]');
      const $modal = document.querySelector('.modal.d-block');
      let isOutside;
      let isCloseBtn;
      let isEscape;
      if (event.type === 'click') {
        isCloseBtn = event.target === $closeButton;
        isOutside = !event.target.closest('.modal-content');
      } else if (event.key === 'Escape') {
        isEscape = true;
      }
      if (isCloseBtn || isOutside || isEscape) {
        $modal.classList.remove('open');
        $modal.removeEventListener('click', handleModal);
        window.removeEventListener('keydown', handleModal);
      }
    }

    const modal = `
      <div class="modal d-block" tabindex="-1" role="dialog" data-show="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">User selection</h5>
            </div>
            <select class="modal-body users" size="3">
            </select>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
      </div>`;

    const $currentUser = document.querySelector('#manage-user');
    document.body.insertAdjacentHTML('afterbegin', modal);

    $currentUser.addEventListener('click', () => {
      const modalBody = document.querySelector('.modal-body');
      modalBody.innerHTML = '';
      this.users.forEach((user) => {
        modalBody.insertAdjacentHTML('afterbegin', `<option>${user.email} ${user.displayName}</option>`);
      });

      const $modal = document.querySelector('.modal.d-block');
      $modal.classList.add('open');
      $modal.addEventListener('click', handleModal);
      window.addEventListener('keydown', handleModal);
    });
  }
}
