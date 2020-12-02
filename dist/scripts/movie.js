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
    totalPages = response.data.total_pages;
    if (totalPages == 1) {
      loadMoreBtn.classList.add('no-show');
    }
    if (response.data.total_results === 0) {
      document
        .getElementById('no-results-container')
        .classList.remove('no-show');
      document
        .getElementById('billboard-title-container')
        .classList.add('no-show');
    } else {
      document.getElementById('no-results-container').classList.add('no-show');
      element.forEach((movie) => {
        const eachMovie = new Movie(
          movie.title,
          movie.poster_path,
          movie.release_date,
          movie.id
        );
        draw(eachMovie);
      });
    }
  });
};

const draw = (data) => {
  const billboard = document.getElementById('billboard');
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
            <div class="movie-text-container"><p class="movie-text">${
              data.title
            } (${data.releaseDate.slice(0, 4)})</p></div>
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
  constructor(
    title,
    poster,
    releaseDate,
    movieId,
    score,
    genres,
    certification,
    duration,
    overview
  ) {
    super(title, poster, releaseDate, movieId);
    this.score = score;
    this.genres = genres;
    this.certification = certification;
    this.duration = duration;
    this.overview = overview;
  }
}

const loadMoviePageData = async (
  searchURL,
  recommendationsURL,
  releaseDateURL
) => {
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
        document
          .getElementById('no-results-container')
          .classList.remove('no-show');
      } else {
        document
          .getElementById('no-results-container')
          .classList.add('no-show');
        recommendationsData.forEach((movie) => {
          const eachMovie = new Movie(
            movie.title,
            movie.poster_path,
            movie.release_date,
            movie.id
          );
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
                    <button class="middle-button"><p>Want To See</p></button>
                    <button class="middle-button"><p>Seen It</p></button>
                    <button id="btn-custom-list" class="middle-button"><p id="p-custom-list">Custom List</p></button>
                </div>
                <div class="movie-data-container">
                    <span class="movie-data movie-rating">${
                      data.score * 10
                    }%</span>
                    <span class="movie-data movie-genre">${genreArray
                      .toString()
                      .replace(/,/g, ' - ')}</span>
                    <span class="movie-data movie-rated">${certification}</span>
                    <span class="movie-data movie-year">${
                      data.releaseDate
                    }</span>
                    <span class="movie-data movie-duration">${duration}</span>
                </div>
                <div class="movie-description-title"><p>Overview</p></div>
                <div class="movie-description-container"><p>${
                  data.overview
                }</p></div>
            </div>
    `;
  moviePageContainer.innerHTML = movieContainer;
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-movie-page')) {
    const movieId = new URLSearchParams(window.location.search).get('id');
    if (movieId) {
      const searchURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      const recommendationsURL = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`;
      const releaseDateURL = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apiKey}`;
      // releaseDateURL is for get Certification. Example: PG-13 or +18.
      loadMoviePageData(searchURL, recommendationsURL, releaseDateURL);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('main-login-page')) {
    const from = new URLSearchParams(window.location.search).get('from');
    if (from && from === 'signup') {
      document
        .getElementById('verification-message')
        .classList.remove('no-show');
    }
  }
});
