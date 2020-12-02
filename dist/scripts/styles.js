// Show Mobile Menu
document.getElementById('menu-icon').addEventListener('click', () => {
  document.getElementById('item-container').classList.add('show-mobile-menu');
});

document.getElementById('close-icon').addEventListener('click', () => {
  document
    .getElementById('item-container')
    .classList.remove('show-mobile-menu');
});

// Show Modal Custom List
/* if (document.getElementById('btn-custom-list')) {
  document.getElementById('btn-custom-list').addEventListener('click', () => {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  }); */

document.addEventListener('click', (event) => {
  if (
    event.target.id === 'btn-custom-list' ||
    event.target.id === 'p-custom-list'
  ) {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  }
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-container')) {
    document.getElementById('modal-custom-list').classList.remove('show-flex');
    document.getElementById('modal-searcher-input').value = '';
  }
});
//}

// Show Modal Create List & Show Modal Edit List
if (document.getElementById('btn-create-list')) {
  document.getElementById('btn-create-list').addEventListener('click', () => {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-container')) {
      document
        .getElementById('modal-custom-list')
        .classList.remove('show-flex');
      document.getElementById('modal-input').value = '';
    }
  });
}

console.log('works');

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

const goToIndex = () => {
  window.location.pathname = '/index.html';
};

const showLoader = () => {
  const main = document.getElementById('main-login-page');
  main.innerHTML = '';
  main.innerHTML = `
              <div class="loaderContainer">
                <div class="loader"></div>
              </div>;
`;
};

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
