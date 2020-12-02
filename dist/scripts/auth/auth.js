class Autenticacion {
  async autEmailPass(email, password) {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      if (result.user.emailVerified) {
        return result;
      }

      await firebase.auth().signOut();
      return null;
    } catch (error) {
      console.error(error);
      showToastMessage(error.message);
      Materialize.toast(error.message, 4000);
    }
  }

  async createUserEmailPass(email, password, firstname, lastname) {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await result.user.updateProfile({
        displayName: firstname + ' ' + lastname,
      });

      const configuration = {
        url: 'https://movie-searcher-2dbe3.firebaseapp.com/',
      };

      await result.user.sendEmailVerification(configuration);

      await firebase.auth().signOut();

      return true;
    } catch (error) {
      console.error(error);
      showToastMessage(error.message);
      Materialize.toast(error.message, 4000);
    }
  }

  async authGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await firebase.auth().signInWithPopup(provider);

      if (result) {
        return result.user;
      }

      return undefined;
    } catch (error) {
      console.error(error);
      Materialize.toast(`Error al autenticarse con google: ${error} `, 4000);
    }
  }

  async authFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();

      const result = await firebase.auth().signInWithPopup(provider);

      if (result) {
        return result.user;
      }

      return undefined;
    } catch (error) {
      console.error(error);
      Materialize.toast(`Error al autenticarse con google: ${error} `, 4000);
    }
  }

  authTwitter() {
    // TODO: Crear auth con twitter
  }
}
