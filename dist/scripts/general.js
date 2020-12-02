$(() => {
  //$('.tooltiped').tooltip({ delay: 50 });
  //$('.modal').modal();

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var database = firebase.database();
});
