$(() => {
  const objAuth = new Autenticacion();

  // btn Listener of Register.
  $('#btnEmailRegister').click(async () => {
    const firstname = $('#firstnameReg').val();
    const lastname = $('#lastnameReg').val();
    const email = $('#emailReg').val();
    const password = $('#passwordReg').val();
    await objAuth.createUserEmailPass(email, password, firstname, lastname);
    window.location.href = window.location.href.slice(0, -12) + 'login.html?from=signup';
  });

  // btn Listener of Login with Email+Pass
  $('#btnEmailLogin').click(async () => {
    const email = $('#emailLog').val();
    const password = $('#passwordLog').val();
    const resp = await objAuth.autEmailPass(email, password);
    if (resp) {
      showToastMessage(`Welcome ${resp.user.displayName}`);
      Materialize.toast(`Bienvenido ${resp.user.displayName}`, 5000);
    } else {
      showToastMessage(`Verify your email`);
      Materialize.toast(`Por favor realiza la verificación de la cuenta`, 5000);
    }
  });

  // btn Listener of Login with Google
  $('#btnGoogleLogin').click(async () => {
    const user = await objAuth.authGoogle();
    showToastMessage(`Welcome ${user.displayName}`);
    Materialize.toast(`Bienvenido ${user.displayName} !! `, 4000);
  });

  // btn Listener of Login with Facebook
  $('#btnFacebookLogin').click(async () => {
    const user = await objAuth.authFacebook();
    showToastMessage(`Welcome ${user.displayName}`);
    Materialize.toast(`Bienvenido ${user.displayName} !! `, 4000);
  });

  // btn Listener of Signout button.
  $('#btnSignOut').click(async () => {
    try {
      firebase.auth().signOut();
      window.location.pathname = '/index.html';
    } catch (error) {
      console.error(error);
    }
  });

  // btn Listener of ChangeName button.
  $('#btnUpdateName').click(async () => {
    const newName = $('#newNameInput').val();
    try {
      const user = await firebase.auth().currentUser;
      if (user) {
        user.updateProfile({
          displayName: newName,
        });
        showToastMessage(`Changes saved. Reload to see it.`);
      }
    } catch (error) {
      console.error(error);
      Materialize.toast(error.message, 4000);
    }
  });

  // btn Listener of CreateCustomList button.
  $('#btnCreateCustomList').click(async () => {
    const newListName = $('#modal-input').val();
    const input = document.getElementById('modal-input');
    const pattern = new RegExp('^[A-Za-z0-9 ]+$', 'i');
    if (!pattern.test(input.value)) {
      showToastMessage('You can use only letters, numbers and spaces in the Listname');
    } else {
      try {
        const array = { list: [] };
        const userUid = firebase.auth().currentUser.uid;
        let docRef = firebase
          .firestore()
          .collection('accounts')
          .doc(firebase.auth().currentUser.uid)
          .collection('lists')
          .doc(newListName);
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              showToastMessage('There is already a list created with that name');
            } else {
              docRef.set(array);
              noShowModalCreateList();
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error);
          });
      } catch (error) {
        console.error(error);
        Materialize.toast(error.message, 4000);
      }
    }
  });

  // Checked & Unchecked functions. This is used to show if the MovieSelected is in the List, changing a class of the ListButton.
  document.addEventListener('click', (event) => {
    if (
      (event.target.id === 'btnWantToSee' && event.target.classList.contains('unchecked')) ||
      (event.target.parentElement.id === 'btnWantToSee' && event.target.parentElement.classList.contains('unchecked'))
    ) {
      addMovieToListFunction('WantToSee', 'add');
      firebaseListener();
    }
    if (
      (event.target.id === 'btnSeenIt' && event.target.classList.contains('unchecked')) ||
      (event.target.parentElement.id === 'btnSeenIt' && event.target.parentElement.classList.contains('unchecked'))
    ) {
      addMovieToListFunction('SeenIt', 'add');
      firebaseListener();
    }
    // btn WantToSee + checked
    if (event.target.classList.contains('checked') && event.target.id === 'btnWantToSee') {
      addMovieToListFunction('WantToSee', 'remove');
      firebaseListener();
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    if (event.target.parentElement.classList.contains('checked') && event.target.parentElement.id === 'btnWantToSee') {
      addMovieToListFunction('WantToSee', 'remove');
      firebaseListener();
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    // btn SeenIt + checked
    if (event.target.classList.contains('checked') && event.target.id === 'btnSeenIt') {
      addMovieToListFunction('SeenIt', 'remove');
      firebaseListener();
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    if (event.target.parentElement.classList.contains('checked') && event.target.parentElement.id === 'btnSeenIt') {
      addMovieToListFunction('SeenIt', 'remove');
      firebaseListener();
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }

    if (event.target.classList.contains('unchecked-custom')) {
      addMovieToListFunction(event.target.childNodes[0].innerHTML, 'add');
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    if (event.target.parentElement.classList.contains('unchecked-custom')) {
      addMovieToListFunction(event.target.innerHTML, 'add');
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    if (event.target.classList.contains('checked-custom')) {
      addMovieToListFunction(event.target.childNodes[0].innerHTML, 'remove');
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
    if (event.target.parentElement.classList.contains('checked-custom')) {
      addMovieToListFunction(event.target.innerHTML, 'remove');
      if (document.getElementById('modal-custom-list').classList.contains('show-flex')) {
        document.getElementById('modal-custom-list').classList.remove('show-flex');
      }
    }
  });

  // getListSelected, after getMovieSelected and then add/remove MovieSelected from ListSelected
  const addMovieToListFunction = async (listSelected, task) => {
    try {
      const list = listSelected;
      const job = task;
      const movieId = new URLSearchParams(window.location.search).get('id');
      const searchURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      loadMovieData(searchURL, list, job);
    } catch (error) {
      console.error(error);
    }
  };

  // getCurrentUser if user is logued.
  // Spanish comments:
  // Soluciona el error de poner una función de Firebase en DOMContentLoaded. Es como un DOMContentLoaded para Firebase.
  // Firebase observador del cambio de estado de auth
  // Si el user existe, o sea hay una sesión iniciada, cambiar texto de un boton a Salir y agrega foto del user.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebaseLoadedListData();
      if (document.getElementById('main-my-lists-page')) {
        loadMyLists();
      }
      firebaseListener();
      $('#myUserContainer').removeClass('no-show');
      $('#myListsContainer').removeClass('no-show');
      $('#loginLinkContainer').addClass('no-show');
      $('#loguedEmail').text(user.email);
      $('#loguedFirstname').text(user.displayName);
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL);
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
      }
    } else {
      $('#myUser').text('My User');
      $('#avatar').attr('src', 'imagenes/usuario.png');
    }
  });
});
