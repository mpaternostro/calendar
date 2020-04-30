export default class ManageUser {
  // LLAMADO A LA API PARA QUE LE DEN LOS USUARIOS
  constructor(users) {
    this.users = [...users];
  }

  //   newUser(email, displayName) {
  //     return new User(email, displayName);
  //   }

  showUsers() {
    this.modal = `
      <div class="modal d-block" tabindex="-1" role="dialog" data-show="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">User selection</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Select</button>
            </div>
          </div>
        </div>
      </div>`;

    const $currentUser = document.querySelector('#manage-user');
    $currentUser.addEventListener('click', () => {
      document.body.insertAdjacentHTML('afterbegin', this.modal);
      this.modalBody = document.querySelector('.modal-body');
      this.users.forEach((user) => {
        this.modalBody.insertAdjacentHTML('afterbegin', `<p>${user.email} ${user.displayName}</p>`);
      });
    });
  }
}
