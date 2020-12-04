class Movie {
  constructor(title, poster, releaseDate, movieId) {
    this.title = title;
    this.poster = poster;
    this.releaseDate = releaseDate;
    this.movieId = movieId;
  }
}

const apiKey = '81d1f6291941e4cbb7818fa6c6be6f85';

let totalPages;

// loadData & draw for Home Page.
const loadData = async (searchURL) => {
  const response = await axios.get(searchURL).then(function (response) {
    const element = response.data.results;
    console.log(response.data.results);
    totalPages = response.data.total_pages;
    if (totalPages == 1) {
      loadMoreBtn.classList.add('no-show');
    }
    if (response.data.total_results === 0) {
      document.getElementById('no-results-container').classList.remove('no-show');
      document.getElementById('billboard-title-container').classList.add('no-show');
    } else {
      document.getElementById('no-results-container').classList.add('no-show');
      element.forEach((movie) => {
        const eachMovie = new Movie(movie.title, movie.poster_path, movie.release_date, movie.id);
        draw(eachMovie);
      });
    }
  });
};

const draw = (data) => {
  console.log(data.title);
  const billboard = document.getElementById('billboard');
  console.log(billboard);
  let posterSrc;
  if (data.poster === null) {
    posterSrc = './img/posters/not-found-image-15383864787lu.jpg';
  } else {
    posterSrc = `https://image.tmdb.org/t/p/w220_and_h330_face/${data.poster}`;
  }
  let movieCardLink;
  if (document.getElementById('main-index')) {
    movieCardLink = `./html/movie.html?id=${data.movieId.toString()}`;
  } else {
    movieCardLink = `./movie.html?id=${data.movieId.toString()}`;
  }
  const movieContainer = `
      <a class="movie" href="${movieCardLink}">
            <div class="poster-container"><img class="poster-image" src="${posterSrc}" alt="Movie image"></div>
            <div class="movie-text-container"><p class="movie-text">${data.title} (${data.releaseDate.slice(0, 4)})</p></div>
        </a>
    `;
  billboard.insertAdjacentHTML('beforeend', movieContainer);
};

// Searching:
const searcher = document.getElementById('main-searcher');
const searchBtn = document.getElementById('search-btn');
if (searchBtn !== null) {
  searchBtn.addEventListener('click', () => {
    search();
  });
}
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    search();
  }
});

const search = () => {
  if (new URLSearchParams(window.location.search).get('page')) {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', '1');
    history.replaceState(null, null, '?' + queryParams.toString());
  }
  loadMoreBtn.classList.remove('no-show');
  const searchValueWithSpaces = searcher.value.trim().toLowerCase();
  const searchValue = searcher.value.trim().replace(/ /g, '+');
  const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchValue}`;
  const billboard = document.getElementById('billboard');
  billboard.innerHTML = '';
  const billboardTitle = document.getElementById('billboard-title');
  billboardTitle.innerHTML = '';
  billboardTitle.innerHTML = `Found movies with '${searchValueWithSpaces}' >`;
  loadData(searchURL);
};

const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn !== null) {
  loadMoreBtn.addEventListener('click', () => {
    loadMoreMovies();
  });
}

const loadMoreMovies = () => {
  let pageInURL = new URLSearchParams(window.location.search).get('page');
  let newPage;
  if (pageInURL === null) {
    newPage = '2';
  } else {
    newPage = parseInt(pageInURL) + 1;
  }
  if (totalPages == newPage) {
    loadMoreBtn.classList.add('no-show');
  }
  let queryParams = new URLSearchParams(window.location.search);
  queryParams.set('page', newPage);
  history.replaceState(null, null, '?' + queryParams.toString());
  const page = new URLSearchParams(window.location.search).get('page');
  const searchValue = searcher.value.trim().replace(/ /g, '+');
  const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=${page}&query=${searchValue}`;
  loadData(searchURL);
};

// Trending Movies on DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-index')) {
    const page = '1';
    const searchURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}`;
    const billboard = document.getElementById('billboard');
    billboard.innerHTML = '';
    loadData(searchURL);
  }
});

class MoviePage extends Movie {
  constructor(title, poster, releaseDate, movieId, score, genres, certification, duration, overview) {
    super(title, poster, releaseDate, movieId);
    this.score = score;
    this.genres = genres;
    this.certification = certification;
    this.duration = duration;
    this.overview = overview;
  }
}

const loadMoviePageData = async (searchURL, recommendationsURL, releaseDateURL) => {
  const requestOne = axios.get(searchURL);
  const requestTwo = axios.get(recommendationsURL);
  const requestThree = axios.get(releaseDateURL);

  const response = await axios.all([requestOne, requestTwo, requestThree]).then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseTwo = responses[1];
      const responseThree = responses[2];

      const movieData = responseOne.data;
      const recommendationsData = responseTwo.data.results.slice(0, 7);
      const certificationData = responseThree.data.results;

      let certification;
      certificationData.forEach((eachCountry) => {
        if (eachCountry.iso_3166_1 === 'US') {
          certification = eachCountry.release_dates[0].certification;
        }
      });

      const moviePage = new MoviePage(
        movieData.title,
        movieData.poster_path,
        movieData.release_date,
        movieData.id,
        movieData.vote_average,
        movieData.genres,
        certification,
        movieData.runtime,
        movieData.overview
      );
      drawMoviePage(moviePage);

      if (recommendationsData.length === 0) {
        document.getElementById('no-results-container').classList.remove('no-show');
      } else {
        document.getElementById('no-results-container').classList.add('no-show');
        recommendationsData.forEach((movie) => {
          const eachMovie = new Movie(movie.title, movie.poster_path, movie.release_date, movie.id);
          draw(eachMovie);
        });
      }
    })
  );
};

const drawMoviePage = (data) => {
  const moviePageContainer = document.getElementById('movie-container');
  let eachGenre;
  let genreArray = [];
  for (let genre of data.genres) {
    eachGenre = genre.name;
    genreArray.push(eachGenre);
  }
  let posterSrc;
  if (data.poster === null) {
    posterSrc = './img/posters/not-found-image-15383864787lu.jpg';
  } else {
    posterSrc = `https://image.tmdb.org/t/p/original/${data.poster}`;
  }
  let duration;
  if (data.duration === 0) {
    duration = 'Duration: No info';
  } else {
    duration = data.duration + ' min';
  }
  let certification;
  if (data.certification === undefined) {
    certification = '';
  } else {
    certification = data.certification;
  }
  const movieContainer = `
            <div class="movie-poster-container">
                <img class="movie-poster" src="${posterSrc}" alt="">
            </div>
            <div class="movie-info-container">
                <div class="movie-title-container">
                    <h1 class="movie-title">${data.title}</h1>
                </div>
                <div class="movie-buttons-container">
                    <button id="btnWantToSee" class="middle-button unchecked"><p>Want To See</p></button>
                    <button id="btnSeenIt" class="middle-button unchecked""><p>Seen It</p></button>
                    <button id="btn-custom-list" class="middle-button unchecked"><p id="p-custom-list">All My Lists</p></button>
                </div>
                <div class="movie-data-container">
                    <span class="movie-data movie-rating">${data.score * 10}%</span>
                    <span class="movie-data movie-genre">${genreArray.toString().replace(/,/g, ' - ')}</span>
                    <span class="movie-data movie-rated">${certification}</span>
                    <span class="movie-data movie-year">${data.releaseDate}</span>
                    <span class="movie-data movie-duration">${duration}</span>
                </div>
                <div class="movie-description-title"><p>Overview</p></div>
                <div class="movie-description-container"><p>${data.overview}</p></div>
            </div>
    `;
  moviePageContainer.innerHTML = movieContainer;
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-movie-page')) {
    showLoader('movie-container');
    const movieId = new URLSearchParams(window.location.search).get('id');
    if (movieId) {
      const searchURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      const recommendationsURL = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`;
      const releaseDateURL = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apiKey}`;
      // releaseDateURL is for get Certification. Example: PG-13 or +18.
      loadMoviePageData(searchURL, recommendationsURL, releaseDateURL);
      //console.log(firebase.auth());
      //firebaseListener();
      //loadCustomListsCreated();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-login-page')) {
    const from = new URLSearchParams(window.location.search).get('from');
    if (from && from === 'signup') {
      document.getElementById('verification-message').classList.remove('no-show');
    }
  }
});

const loadMovieData = async (searchURL, list, job) => {
  const response = await axios.get(searchURL).then(function (response) {
    const data = response.data;
    console.log('loadMovieData');
    if (job === 'add') {
      console.log('loadMovieData add');
      addMovieToList(data, list);
    }
    if (job === 'remove') {
      console.log('loadMovieData remove');
      removeMovieFromList(data, list);
    }
  });
};

const addMovieToList = (data, list) => {
  console.log('addMovieToList executed');
  let docRef = firebase.firestore().collection('accounts').doc(firebase.auth().currentUser.uid).collection('lists').doc(list);
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        docRef.update({
          list: firebase.firestore.FieldValue.arrayUnion({
            title: data.title,
            id: data.id,
            poster: data.poster_path,
            release: data.release_date,
          }),
        });
        showToastMessage('Se agregó a la lista correctamente');
      } else {
        console.log(doc.data());
        console.log('el documento no existe.');
      }
    })
    .catch(function (error) {
      console.log('Error getting document:', error);
    });
};

const loadCustomListsCreated = async () => {
  if (firebase.auth().currentUser === null) {
    document.getElementById('modal-custom-list').classList.remove('show-flex');
    showToastMessage('Login to use this feature');
  } else {
    await firebase
      .firestore()
      .collection('accounts')
      .doc(firebase.auth().currentUser.uid)
      .collection('lists')
      .get()
      .then(function (querySnapshot) {
        document.getElementById('modal-custom-lists-results').innerHTML = '';
        querySnapshot.forEach(function (doc) {
          let arrayMovieId = [];
          doc.data().list.forEach(function (eachMovie) {
            arrayMovieId.push(eachMovie.id);
          });
          drawCustomListsCreated(doc.id, arrayMovieId);
        });
      });
  }
};

const drawCustomListsCreated = (listName, arrayMovieId) => {
  const container = document.getElementById('modal-custom-lists-results');
  const movieIdinURL = new URLSearchParams(window.location.search).get('id');
  let checked;
  if (arrayMovieId.includes(parseInt(movieIdinURL))) {
    checked = 'checked-custom';
  } else {
    checked = 'unchecked-custom';
  }
  const listContainer = `
                  <button class="list-select background-color-main ${checked}"><p>${listName}</p></button>
    `;
  container.insertAdjacentHTML('beforeend', listContainer);
};

const removeMovieFromList = (data, list) => {
  let docRef = firebase.firestore().collection('accounts').doc(firebase.auth().currentUser.uid).collection('lists').doc(list);
  docRef.get().then(function (doc) {
    if (doc.exists) {
      docRef.update({
        list: firebase.firestore.FieldValue.arrayRemove({
          title: data.title,
          id: data.id,
          poster: data.poster_path,
          release: data.release_date,
        }),
      });
      showToastMessage('Se eliminó de la lista correctamente');
    } else {
      console.log(doc.data());
      console.log('el documento no existe.');
    }
  });
};

const loadMyLists = () => {
  firebase
    .firestore()
    .collection('accounts')
    .doc(firebase.auth().currentUser.uid)
    .collection('lists')
    .onSnapshot(function (querySnapshot) {
      var lists = [];
      const container = document.getElementById('my-lists-info-container');
      container.innerHTML = '';
      querySnapshot.forEach(function (doc) {
        lists.push(doc.id);
        drawMyLists(doc.id);
      });
      console.log('Lists: ', lists);
    });
};

const drawMyLists = (listName) => {
  const container = document.getElementById('my-lists-info-container');
  const listContainer = `
              <button class="list-select" onclick="window.location.href='./list.html?list=${listName.replace(
                /\s/g,
                '-'
              )}'"><p>${listName}</p></button>
  `;
  container.insertAdjacentHTML('beforeend', listContainer);
};

const firebaseListener = () => {
  if (firebase.auth().currentUser !== null) {
    firebase
      .firestore()
      .collection('accounts')
      .doc(firebase.auth().currentUser.uid)
      .collection('lists')
      .doc('WantToSee')
      .onSnapshot(function (doc) {
        //console.log('snapshot WantToSee');
        const movieIdinURL = new URLSearchParams(window.location.search).get('id');
        let arrayMovieId = [];
        doc.data().list.forEach(function (eachMovie) {
          arrayMovieId.push(eachMovie.id);
          //console.log(arrayMovieId);
          if (arrayMovieId.includes(parseInt(movieIdinURL))) {
            console.log('remove unchecked y add checked');
            document.getElementById('btnWantToSee').classList.remove('unchecked');
            document.getElementById('btnWantToSee').classList.add('checked');
          } else {
            //console.log('remove checked y add unchecked');
            document.getElementById('btnWantToSee').classList.remove('checked');
            document.getElementById('btnWantToSee').classList.add('unchecked');
          }
          /*         if (eachMovie.id === parseInt(movieIdinURL) && document.getElementById('btnWantToSee').classList.contains('unchecked')) {
        console.log('remove unchecked y add checked');
        document.getElementById('btnWantToSee').classList.remove('unchecked');
        document.getElementById('btnWantToSee').classList.add('checked');
      }
      if (document.getElementById('btnWantToSee').classList.contains('checked')) {
        console.log('remove checked y add unchecked');
        document.getElementById('btnWantToSee').classList.remove('checked');
        document.getElementById('btnWantToSee').classList.add('unchecked');
      } */
        });
      });
    firebase
      .firestore()
      .collection('accounts')
      .doc(firebase.auth().currentUser.uid)
      .collection('lists')
      .doc('SeenIt')
      .onSnapshot(function (doc) {
        //console.log('snapshot SeenIt');
        //console.log(doc.data());
        const movieIdinURL = new URLSearchParams(window.location.search).get('id');
        let arrayMovieId = [];
        doc.data().list.forEach(function (eachMovie) {
          arrayMovieId.push(eachMovie.id);
          //console.log(arrayMovieId);
          if (arrayMovieId.includes(parseInt(movieIdinURL))) {
            //console.log('remove unchecked y add checked');
            document.getElementById('btnSeenIt').classList.remove('unchecked');
            document.getElementById('btnSeenIt').classList.add('checked');
          } else {
            //console.log('remove checked y add unchecked');
            document.getElementById('btnSeenIt').classList.remove('checked');
            document.getElementById('btnSeenIt').classList.add('unchecked');
          }
          /*         if (eachMovie.id === parseInt(movieIdinURL) && document.getElementById('btnWantToSee').classList.contains('unchecked')) {
        console.log('remove unchecked y add checked');
        document.getElementById('btnWantToSee').classList.remove('unchecked');
        document.getElementById('btnWantToSee').classList.add('checked');
      }
      if (document.getElementById('btnWantToSee').classList.contains('checked')) {
        console.log('remove checked y add unchecked');
        document.getElementById('btnWantToSee').classList.remove('checked');
        document.getElementById('btnWantToSee').classList.add('unchecked');
      } */
        });
      });
  } else {
    showToastMessage('Login to use this feature');
  }
};

const loadListData = (listName, sum) => {
  console.log('loadListData');
  // onSnapshot
  firebase
    .firestore()
    .collection('accounts')
    .doc(firebase.auth().currentUser.uid)
    .collection('lists')
    .doc(listName.replace(/-/g, ' '))
    .onSnapshot(function (doc) {
      const billboard = document.getElementById('billboard');
      console.log(doc.data().list.length);
      if (doc.data().list.length === 0) {
        billboard.innerHTML = `
                                <div id="no-results-container" class="no-results-container">
                                  <div class="no-results big-button-only-info"><p>No results found</p></div>
                                </div>`;
      } else if (doc.data().list.length === 1 && doc.data().list[0].id === '-100') {
        billboard.innerHTML = `
                                <div id="no-results-container" class="no-results-container">
                                  <div class="no-results big-button-only-info"><p>No results found</p></div>
                                </div>`;
      } else {
        if (sum === undefined) {
          console.log('sumUndefined', sum, doc.data().list.length);
          if (doc.data().list.length > sumMoviesToLoadInList) {
            document.getElementById('load-more-btn-list').classList.remove('no-show');
          }
          billboard.innerHTML = '';
          doc
            .data()
            .list.slice(0, sumMoviesToLoadInList)
            .forEach(function (eachMovie) {
              //console.log(eachMovie);
              if (eachMovie.id === '-100') {
                console.log('encontramos al impostor');
              } else {
                drawListData(eachMovie);
              }
            });
        } else {
          console.log('sumDefined', sum, doc.data().list.length);
          if (
            parseInt(sum) >= doc.data().list.length
            /* sum == doc.data().list.length ||
            doc.data().list.length == parseInt(sum) - 1 ||
            doc.data().list.length == parseInt(sum) - 2 */
          ) {
            document.getElementById('load-more-btn-list').classList.add('no-show');
          }
          console.log(sum);
          let x = sum - sumMoviesToLoadInList;
          doc
            .data()
            .list.slice(x, sum)
            .forEach(function (eachMovie) {
              //console.log(eachMovie);
              if (eachMovie.id === '-100') {
                console.log('encontramos al impostor');
              } else {
                drawListData(eachMovie);
              }
            });
        }

        /* doc.data().list.forEach(function (eachMovie) {
          //console.log(eachMovie);
          if (eachMovie.id === '-100') {
            console.log('encontramos al impostor');
          } else {
            drawListData(eachMovie);
          }
        }); */
      }
    });
};

// Cantidad de peliculas que quiero se carguen en la carga inicial de cada lista. Después iran de este numero en este numero.
// Ejemplo: 20. 20,40,60,80,etc.
let sumMoviesToLoadInList = 20;

const loadMoreMoviesInList = () => {
  const listName = new URLSearchParams(window.location.search).get('list');
  let sumInURL = new URLSearchParams(window.location.search).get('sum');
  let newSum;
  if (sumInURL === null) {
    newSum = sumMoviesToLoadInList.toString() * 2;
  } else {
    newSum = parseInt(sumInURL) + sumMoviesToLoadInList;
  }
  /*   if (totalPages == newSum) {
    loadMoreBtn.classList.add('no-show');
  } */
  let queryParams = new URLSearchParams(window.location.search);
  queryParams.set('sum', newSum);
  history.replaceState(null, null, '?' + queryParams.toString());
  const sum = new URLSearchParams(window.location.search).get('sum');
  loadListData(listName, sum);
};

const drawListData = (data) => {
  //console.log(data.title);
  const billboard = document.getElementById('billboard');
  //console.log(billboard);
  let posterSrc;
  if (data.poster === null) {
    posterSrc = './img/posters/not-found-image-15383864787lu.jpg';
  } else {
    posterSrc = `https://image.tmdb.org/t/p/w220_and_h330_face/${data.poster}`;
  }
  let movieCardLink;
  if (document.getElementById('main-index')) {
    movieCardLink = `./html/movie.html?id=${data.id.toString()}`;
  } else {
    movieCardLink = `./movie.html?id=${data.id.toString()}`;
  }
  const movieContainer = `
      <a class="movie" href="${movieCardLink}">
            <div class="poster-container"><img class="poster-image" src="${posterSrc}" alt="Movie image"></div>
            <div class="movie-text-container"><p class="movie-text">${data.title} (${data.release.slice(0, 4)})</p></div>
        </a>
    `;
  billboard.insertAdjacentHTML('beforeend', movieContainer);
};

const drawMainContent = (listName) => {
  console.log('drawMainContent');
  let question;
  if (listName === 'WantToSee' || listName === 'SeenIt') {
    question = '';
  } else {
    question = `
            <div class="list-buttons-container">
                <button id="btn-edit-list" class="middle-button"><p>Edit listname</p></button>
                <button id="btn-delete-list" class="middle-button"><p>Delete list</p></button>
            </div>
    `;
  }
  const mainContainer = document.getElementById('billboard-container');
  const mainContent = `
            <div class="billboard-title-container">
                <h4 class="billbord-title">${listName.replace(/-/g, ' ')} ></h4>
            </div>
            ${question}
            <div id="billboard" class="billboard">

            </div>
            <div class="load-more-container">
                <button id="load-more-btn-list" class="big-button no-show"><p>Load More ></p></button>
            </div>
  `;
  mainContainer.innerHTML = mainContent;
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-list-page')) {
    showLoader('billboard-container');
    const listName = new URLSearchParams(window.location.search).get('list');
    if (listName) {
      drawMainContent(listName);
      console.log('deberia funcionar');
    }
  }
});

const firebaseLoadedListData = () => {
  if (document.getElementById('main-list-page')) {
    const listName = new URLSearchParams(window.location.search).get('list');
    if (listName) {
      console.log('deberia funcionar');
      loadListData(listName);
    }
  }
};

const deleteListSelected = () => {
  const listName = new URLSearchParams(window.location.search).get('list');
  firebase
    .firestore()
    .collection('accounts')
    .doc(firebase.auth().currentUser.uid)
    .collection('lists')
    .doc(listName.replace(/-/g, ' '))
    .delete()
    .then(function () {
      console.log('List successfully deleted!');
      const mainContainer = document.getElementById('main-list-page');
      mainContainer.innerHTML = '';
      mainContainer.innerHTML = `
      <div class="login-container">
         <div class="login-info-container">
             <div class="login-social-title-container">
                 <h3>Document successfully deleted go to Homepage ></h3>
             </div>
             <div class="login-buttons-container">
                 <button id="goToHomeBtnFromDeletedList" class="middle-button"><p>Home</p></button>
             </div>
         </div>
     </div>
`;
      history.replaceState &&
        history.replaceState(null, '', location.pathname + location.search.replace(/[\?&]list=[^&]+/, '').replace(/^&/, '?'));
    })
    .catch(function (error) {
      console.error('Error removing document: ', error);
    });
};

// tiene que obtener la información de la lista seleccionada, crear una nueva lista con el nuevo nombre, insertar la info de la lista seleccionada y borrar la lista seleccionada
const changeListnameSelected = () => {
  const listName = new URLSearchParams(window.location.search).get('list');
  console.log(listName.replace(/-/g, ' '));

  const newName = document.getElementById('modal-input').value;
  console.log(newName);

  let listSelectedData = [];

  const input = document.getElementById('modal-input');
  const pattern = new RegExp('^[A-Za-z0-9 ]+$', 'i');
  if (!pattern.test(input.value)) {
    //console.log('tiene');
    showToastMessage('You can use only letters, numbers and spaces in the Listname');
  } else {
    // obtenemos información de listSelected y la guardamos en listSelectedData
    firebase
      .firestore()
      .collection('accounts')
      .doc(firebase.auth().currentUser.uid)
      .collection('lists')
      .doc(listName.replace(/-/g, ' '))
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data().list);
          listSelectedData = doc.data().list;
          console.log(listSelectedData);
          const array = { list: listSelectedData };
          const userUid = firebase.auth().currentUser.uid;
          let docRef = firebase
            .firestore()
            .collection('accounts')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(newName);
          docRef
            .get()
            .then(function (doc) {
              if (doc.exists) {
                console.log('Ya está creada una lista con ese nombre');
                showToastMessage('Ya está creada una lista con ese nombre');
              } else {
                // acá podría ir un showLoader. Pero es complicado hacerlo. ToDo.
                docRef.set(array);
                //noShowModalCreateList();
                firebase
                  .firestore()
                  .collection('accounts')
                  .doc(firebase.auth().currentUser.uid)
                  .collection('lists')
                  .doc(listName.replace(/-/g, ' '))
                  .delete()
                  .then(function () {
                    console.log('List successfully deleted!');
                    const listName = new URLSearchParams(window.location.search).get('list');
                    console.log(listName);
                    console.log(newName.replace(/ /g, '-'));
                    let queryParams = new URLSearchParams(window.location.search);
                    queryParams.set('list', newName.replace(/ /g, '-'));
                    history.replaceState(null, null, '?' + queryParams.toString());
                    location.reload();
                  })
                  .catch(function (error) {
                    console.error('Error removing document: ', error);
                  });
              }
            })
            .catch(function (error) {
              console.log('Error getting document:', error);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }
};
