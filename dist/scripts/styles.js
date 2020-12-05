// Show Mobile Menu
document.getElementById('menu-icon').addEventListener('click', () => {
  document.getElementById('item-container').classList.add('show-mobile-menu');
});
// Close Mobile Menu
document.getElementById('close-icon').addEventListener('click', () => {
  document.getElementById('item-container').classList.remove('show-mobile-menu');
});

// Show AllMyLists in MoviePage.
document.addEventListener('click', (event) => {
  if (event.target.id === 'btn-custom-list' || event.target.id === 'p-custom-list') {
    document.getElementById('modal-custom-list').classList.add('show-flex');
    showLoader('modal-custom-lists-results');
    loadCustomListsCreated();
  }
});

// Close Modal if we click outside the modal.
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-container')) {
    document.getElementById('modal-custom-list').classList.remove('show-flex');
    document.getElementById('modal-delete-list').classList.remove('show-flex');
    document.getElementById('modal-searcher-input').value = '';
  }
});

// Show Modal Create List (inside are more functions: Modal Edit List, Modal Delete List)
if (document.getElementById('btn-create-list')) {
  document.getElementById('btn-create-list').addEventListener('click', () => {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  });
  // Show Modal Edit List
  document.addEventListener('click', (event) => {
    if (event.target.id === 'btn-edit-list' || event.target.parentElement.id === 'btn-edit-list') {
      document.getElementById('modal-custom-list').classList.add('show-flex');
    } // Show Modal Delete List
    if (event.target.id === 'btn-delete-list' || event.target.parentElement.id === 'btn-delete-list') {
      document.getElementById('modal-delete-list').classList.add('show-flex');
    } // Close Modal Delete List if we click no-button
    if (event.target.id === 'btn-delete-list-no' || event.target.parentElement.id === 'btn-delete-list-no') {
      document.getElementById('modal-delete-list').classList.remove('show-flex');
    } // DeleteListSelected listener. If we click DeleteListSelected is executed.
    if (event.target.id === 'btn-delete-list-yes' || event.target.parentElement.id === 'btn-delete-list-yes') {
      document.getElementById('modal-delete-list').classList.remove('show-flex');
      deleteListSelected();
    } // If we click button with id goToHomeFromDeletedList, it redirects to Homepage.
    if (event.target.id === 'goToHomeBtnFromDeletedList' || event.target.parentElement.id === 'goToHomeBtnFromDeletedList') {
      window.location.pathname = '/index.html';
    } // ChangeListnameSelected listener. If we click ChangeListnameSelected is executed.
    if (event.target.id === 'save-new-listname' || event.target.parentElement.id === 'save-new-listname') {
      document.getElementById('modal-custom-list').classList.remove('show-flex');
      changeListnameSelected();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-container')) {
      document.getElementById('modal-custom-list').classList.remove('show-flex');
      document.getElementById('modal-input').value = '';
    }
  });
}

// Listener of LoadMoreBtn in ListPage. If we click in, loadMoreMoviesInList is executed.
document.addEventListener('click', (event) => {
  if (event.target.id === 'load-more-btn-list' || event.target.parentElement.id === 'load-more-btn-list') {
    console.log('loadMoreBtnList');
    loadMoreMoviesInList();
  }
});

// noShowModalCreateList is executed.
const noShowModalCreateList = () => {
  document.getElementById('modal-custom-list').classList.remove('show-flex');
  document.getElementById('modal-input').value = '';
};

// function insertParams. to global use.
function insertParam(key, value) {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  var kvp = document.location.search.substr(1).split('&');
  let i = 0;

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key + '=')) {
      let pair = kvp[i].split('=');
      pair[1] = value;
      kvp[i] = pair.join('=');
      break;
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = [key, value].join('=');
  }

  // can return this or...
  let params = kvp.join('&');

  // reload page with new params
  document.location.search = params;
}

// showToastMessage function. to global use.
function showToastMessage(message) {
  // Get the snackbar DIV
  var x = document.getElementById('snackbar');
  x.innerHTML = '';
  x.innerHTML = message;
  // Add the "show" class to DIV
  x.className = 'show';

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 3000);
}

// goToIndex function.
const goToIndex = () => {
  window.location.pathname = '/index.html';
};

// showLoader function.
const showLoader = (containerId) => {
  console.log('show loader');
  const main = document.getElementById(containerId);
  main.innerHTML = '';
  main.innerHTML = `
              <div class="loaderContainer">
                <div class="loader"></div>
              </div>
`;
};

// showLoaderDisplayNone function. similar showLoader but with differences.
const showLoaderDisplayNone = (containerId, containerIdToNone) => {
  console.log('show loader');
  const mainToNone = document.getElementById(containerIdToNone);
  const main = document.getElementById(containerId);
  mainToNone.style.display = 'none';
  main.innerHTML = `
              <div class="loaderContainer">
                <div class="loader"></div>
              </div>
`;
};

// successfulLogin function. After you login, this is executed and change the HTML.
const successfulLogin = () => {
  const main = document.getElementById('main-login-page');
  main.innerHTML = '';
  main.innerHTML = `
         <div class="login-container">
            <div class="login-info-container">
                <div class="login-social-title-container">
                    <h3>Successful Login go to Homepage ></h3>
                </div>
                <div class="login-buttons-container">
                    <button id="goToHomeBtn" class="middle-button"><p>Home</p></button>
                </div>
            </div>
        </div>
`;
  document.getElementById('goToHomeBtn').addEventListener('click', () => {
    console.log('goToHome executed');
    window.location.pathname = '/index.html';
  });
};

// Listener of ChangePassword button.
document.getElementById('btnChangePassword').addEventListener('click', () => {
  sendResetPassWordEmail();
});

// sendResetPasswordEmail function. It's executed when you click btnChangePassword.
const sendResetPassWordEmail = () => {
  var auth = firebase.auth();
  var emailAddress = firebase.auth().currentUser.email;

  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      // Email sent.
      showToastMessage('Verify your email to change your password.');
    })
    .catch(function (error) {
      // An error happened.
      console.log(error);
      showToastMessage(`Error: ${error}`);
    });
};
