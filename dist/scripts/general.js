/* $(() => { */
//$('.tooltiped').tooltip({ delay: 50 });
//$('.modal').modal();

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
var currentUser = firebase.auth().currentUser;
/* }); */
