$(() => {
  const objAuth = new Autenticacion();

  $('#btnEmailRegister').click(async () => {
    const firstname = $('#firstnameReg').val();
    const lastname = $('#lastnameReg').val();
    const email = $('#emailReg').val();
    const password = $('#passwordReg').val();
    await objAuth.createUserEmailPass(email, password, firstname, lastname);
    window.location.href =
      window.location.href.slice(0, -12) + 'login.html?from=signup';
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
    //showToastMessage(`Bienvenido ${resp.user.displayName}`);
    //window.location.pathname = '/index.html';
    //$('#avatar').attr('src', user.photoURL);
    //$('.modal').modal('close');
    Materialize.toast(`Bienvenido ${user.displayName} !! `, 4000);
  });

  $('#btnFacebookLogin').click(async () => {
    const user = await objAuth.authFacebook();
    //showToastMessage(`Bienvenido ${resp.user.displayName}`);
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

  // Evento boton inicio sesion
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

  // Firebase observador del cambio de estado de auth
  // Si el user existe, o sea hay una sesión iniciada, cambiar texto de un boton a Salir y agrega foto del user.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
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

  /*   $('#btnRegistrarse').click(() => {
    $('#modalSesion').modal('close');
    $('#modalRegistro').modal('open');
  });

  $('#btnIniciarSesion').click(() => {
    $('#modalRegistro').modal('close');
    $('#modalSesion').modal('open');
  }); */
});
