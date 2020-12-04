$(() => {
  const objAuth = new Autenticacion();

  $('#btnEmailRegister').click(async () => {
    const firstname = $('#firstnameReg').val();
    const lastname = $('#lastnameReg').val();
    const email = $('#emailReg').val();
    const password = $('#passwordReg').val();
    await objAuth.createUserEmailPass(email, password, firstname, lastname);
    window.location.href = window.location.href.slice(0, -12) + 'login.html?from=signup';
    //$('.modal').modal('close');
  });

  $('#btnEmailLogin').click(async () => {
    const email = $('#emailLog').val();
    const password = $('#passwordLog').val();
    const resp = await objAuth.autEmailPass(email, password);
    if (resp) {
      //$('#avatar').attr('src', 'imagenes/usuario_auth.png');
      showToastMessage(`Bienvenido ${resp.user.displayName}`);
      //window.location.pathname = '/index.html';
      Materialize.toast(`Bienvenido ${resp.user.displayName}`, 5000);
    } else {
      showToastMessage(`Por favor realiza la verificación de la cuenta`);
      Materialize.toast(`Por favor realiza la verificación de la cuenta`, 5000);
    }
    //$('.modal').modal('close');
  });

  $('#btnGoogleLogin').click(async () => {
    const user = await objAuth.authGoogle();
    showToastMessage(`Bienvenido ${user.displayName}`);
    //window.location.pathname = '/index.html';
    //$('#avatar').attr('src', user.photoURL);
    //$('.modal').modal('close');
    Materialize.toast(`Bienvenido ${user.displayName} !! `, 4000);
  });

  $('#btnFacebookLogin').click(async () => {
    const user = await objAuth.authFacebook();
    showToastMessage(`Bienvenido ${user.displayName}`);
    //window.location.pathname = '/index.html';
    //$('#avatar').attr('src', user.photoURL);
    //$('.modal').modal('close');
    Materialize.toast(`Bienvenido ${user.displayName} !! `, 4000);
  });

  // $("#authTwitter").click(() => objAuth.authCuentaFacebook());

  $('#btnSignOut').click(async () => {
    try {
      console.log('tocaste el boton de cerrar sesión');
      firebase.auth().signOut();
      //$('#avatar').attr('src', 'imagenes/usuario.png');
      window.location.pathname = '/index.html';
      //Materialize.toast(`SignOut correcto`, 4000);
    } catch (error) {
      console.error(error);
      //Materialize.toast(error.message, 4000);
    }
  });

  $('#btnUpdateName').click(async () => {
    console.log('tocaste el boton de cambiar nombre');
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
    /*     $('#emailSesion').val('');
    $('#passwordSesion').val('');
    $('#modalSesion').modal('open'); */
  });

  $('#btnCreateCustomList').click(async () => {
    console.log('tocaste el boton de crear custom list');
    const newListName = $('#modal-input').val();
    const movieId = 155;
    const movieTitle = 'Carrie';
    console.log(newListName);
    // Código para crear una nueva lista. La validación de si está creada o no la lista, done.
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
            console.log('Ya está creada una lista con ese nombre');
            showToastMessage('Ya está creada una lista con ese nombre');
          } else {
            // acá podría ir un showLoader. Pero es complicado hacerlo. ToDo.
            docRef.set(array);
            noShowModalCreateList();
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    } catch (error) {
      // Código para leer data de una lista
      /* try {
      let docRef = firebase
        .firestore()
        .collection('accounts')
        .doc(firebase.auth().currentUser.uid)
        .collection('user')
        .doc('WantToSee');
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            doc.data().SeenIt.forEach((movie) => {
              console.log(movie.id, movie.title);
            });
          } else {
            console.log('el documento no existe.');
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    } */
      // Codigo para agregar pelicula a una lista
      /* try {
      let docRef = firebase.firestore().collection('accounts').doc(firebase.auth().currentUser.uid);
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            docRef
              .collection('user')
              .doc('WantToSee')
              .update({
                list: firebase.firestore.FieldValue.arrayUnion({ title: movieTitle, id: movieId }),
              });
            console.log(doc.data());
          } else {
            console.log('el documento no existe.');
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    } */ console.error(
        error
      );
      Materialize.toast(error.message, 4000);
    }
  });

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

  // debería llamarse obtiene info de la lista seleccionada y de la pelicula en la que estamos. Y que queremos hacer, añadir o remover.
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

  // Firebase observador del cambio de estado de auth
  // Si el user existe, o sea hay una sesión iniciada, cambiar texto de un boton a Salir y agrega foto del user.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebaseLoadedListData();
      if (document.getElementById('main-my-lists-page')) {
        loadMyLists();
      }
      firebaseListener();
      /*       firebaseListenerWantToSee();
      firebaseListenerSeenIt(); */
      console.log(user);
      $('#myUserContainer').removeClass('no-show');
      $('#myListsContainer').removeClass('no-show');
      $('#loginLinkContainer').addClass('no-show');
      //$('#myUser').text('Edit User');
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
