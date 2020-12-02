class Autenticacion {
  async autEmailPass(email, password) {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      if (result.user.emailVerified) {
        let docRef = firebase
          .firestore()
          .collection('accounts')
          .doc(result.user.uid);
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log(doc.data());
              successfulLogin();
            } else {
              const userUid = result.user.uid;
              const arrays = { WantToSee: [], SeenIt: [] };
              const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                uid: userUid,
                provider: result.user.providerData[0].providerId,
              };
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .set(arrays);
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .collection('user')
                .doc('info')
                .set(userInfo);
              successfulLogin();
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error);
          });
      }

      if (result.user.emailVerified) {
        showLoader();
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
        let docRef = firebase
          .firestore()
          .collection('accounts')
          .doc(result.user.uid);
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log(doc.data());
              successfulLogin();
            } else {
              const userUid = result.user.uid;
              const arrays = { WantToSee: [], SeenIt: [] };
              const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                uid: userUid,
                provider: result.user.providerData[0].providerId,
              };
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .set(arrays);
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .collection('user')
                .doc('info')
                .set(userInfo);
              successfulLogin();
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error);
          });
      }

      if (result) {
        showLoader();
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
        let docRef = firebase
          .firestore()
          .collection('accounts')
          .doc(result.user.uid);
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log(doc.data());
              successfulLogin();
            } else {
              const userUid = result.user.uid;
              const arrays = { WantToSee: [], SeenIt: [] };
              const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                uid: userUid,
                provider: result.user.providerData[0].providerId,
              };
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .set(arrays);
              firebase
                .firestore()
                .collection('accounts')
                .doc(userUid)
                .collection('user')
                .doc('info')
                .set(userInfo);
              successfulLogin();
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error);
          });
      }

      if (result) {
        showLoader();
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
