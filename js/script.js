const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPage: 1,
    totalResults: 0,
  },
  api: {
    apiUrl: 'https://api.themoviedb.org/3/',
    apiKey: '7ae47e1e0e9f08e7d2e29b91dec46687',
  },
};

function highlight() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

async function displaySlider() {
  const { results } = await fetchApiData('movie/now_playing');
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `<div class="swiper-slide">
    <a href="movie-details.html?id=${result.id}">
      <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
    </h4>
  </div>`;
    document.querySelector('.swiper-wrapper').appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function displayPopularMovie() {
  console.log(123);
  const { results } = await fetchApiData('movie/popular');
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img
      src= "https://image.tmdb.org/t/p/w500${result.poster_path}"
      class="card-img-top"
      alt="${result.title}"
    />`
          : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${result.title}"
        />`
      }
      </a>
      <div class="card-body">
      <h5 class="card-title"><i class="fas fa-star text-secondary"></i> ${
        result.vote_average
      } / 10</h5>
        <h5 class="card-title">${result.title}</h5>
 
        <p class="card-text">
          <small class="text-muted">Release: ${result.release_date}</small>

        </p>
      </div>
    `;
    const insert = document.querySelector('#popular-movies');
    insert.appendChild(div);
  });
}

async function displayPopularTV() {
  const { results } = await fetchApiData('tv/popular');
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img
      src= "https://image.tmdb.org/t/p/w500${result.poster_path}"
      class="card-img-top"
      alt="${result.name}"
    />`
          : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${result.name}"
        />`
      }
      </a>
      <div class="card-body">
      <h5 class="card-title"><i class="fas fa-star text-secondary"></i> ${
        result.vote_average
      } / 10</h5>
        <h5 class="card-title">${result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${result.first_air_date}</small>
        </p>
      </div>
    `;
    const insert = document.querySelector('#popular-shows');
    insert.appendChild(div);
  });
}

// display movie details

async function displayMovieDetails() {
  const movieID = window.location.search.split('=')[1];
  const movie = await fetchApiData(`movie/${movieID}`);
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
    <div>
    ${
      movie.poster_path
        ? `<img
    src= "https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
        : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
      ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${movie.genres
        .map((genre) => {
          return `<li>${genre.name}</li>`;
        })
        .join('')}
      </ul>
      <a href= ${
        movie.homepage
      } target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
    </div>
    <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString(
        'en-US'
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString(
        'en-US'
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} min</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies
      .map((company) => {
        return company.name;
      })
      .join(',')}</div>
    </div>
    `;
  document.querySelector('#movie-details').appendChild(div);
}
// display show details

async function displayShowDetails() {
  const showID = window.location.search.split('=')[1];
  const show = await fetchApiData(`tv/${showID}`);
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
    <div>
    ${
      show.poster_path
        ? `<img
    src= "https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
        : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
      />`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last air date: ${show.last_air_date}</p>
      <p>
      ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${show.genres
        .map((genre) => {
          return `<li>${genre.name}</li>`;
        })
        .join('')}
      </ul>
      <a href= ${
        show.homepage
      } target="_blank" class="btn">Visit show Homepage</a>
    </div>
    </div>
    <div class="details-bottom">
    <h2>show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li><span class="text-secondary">Number of seasons:</span> ${
        show.number_of_seasons
      }</li>
      <li><span class="text-secondary">Episode run time:</span> ${
        show.episode_run_time
      } min</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies
      .map((company) => {
        return company.name;
      })
      .join(',')}</div>
    </div>
    `;
  document.querySelector('#show-details').appendChild(div);
}

async function fetchApiData(endpoint) {
  showSpinner();
  const apiKey = global.api.apiKey;
  const url = global.api.apiUrl;
  const response = await fetch(
    `${url}${endpoint}?api_key=${apiKey}&language=en-US`
  );
  hideSpinner();
  return await response.json();
}

/* async function test() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  console.log(res.json());
} */

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

async function searchApiData() {
  showSpinner();
  const apiKey = global.api.apiKey;
  const url = global.api.apiUrl;
  const response = await fetch(
    `${url}search/${global.search.type}?api_key=${apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  hideSpinner();
  return await response.json();
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// display page movie detail

// showing alert message

function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}

// search for movie and tv shows
async function search() {
  urlParm = new URLSearchParams(window.location.search);
  global.search.term = urlParm.get('search-term');
  global.search.type = urlParm.get('type');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchApiData();
    if (results.length == 0) {
      showAlert('No results found', 'alert-error');
    }
    global.search.page = page;
    global.search.totalPage = total_pages;
    global.search.totalResults = total_results;
    displaySearchResults(results);
    await displayPagination();
  } else {
    showAlert('You must enter anything to search', 'alert-error');
  }
}

function displaySearchResults(results) {
  document.querySelector('#search-results').innerHTML = ``;
  document.querySelector('#search-results-heading').innerHTML = ``;
  document.querySelector('#pagination').innerHTML = ``;
  document.querySelector('#search-results-heading').innerHTML = `
                                    <h2>${results.length} of ${global.search.totalResults} <h2>`;
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${
        global.search.type == 'movie' ? 'movie-details.html' : 'tv-details.html'
      }?id=${result.id}">
      ${
        result.poster_path
          ? `<img
      src= "https://image.tmdb.org/t/p/w500/${result.poster_path}"
      class="card-img-top"
      alt="${global.search.type == 'movie' ? result.title : result.name}"
    />`
          : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type == 'movie' ? result.title : result.name}"
        />`
      }
      </a>
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-star text-secondary"></i> ${
          result.vote_average
        } / 10
             </h5>
        <h5 class="card-title">${
          global.search.type == 'movie' ? result.title : result.name
        }</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${
            global.search.type == 'movie'
              ? result.release_date
              : result.first_air_date
          }</small>
        </p>
      </div>
    `;
    const insert = document.querySelector('#search-results');
    insert.appendChild(div);
  });
}

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `          
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPage}</div>
  `;
  document.querySelector('#pagination').appendChild(div);
  if (global.search.page == 1) {
    document.querySelector('#prev').disabled = true;
  }

  if (global.search.page == global.search.totalPage) {
    document.querySelector('#next').disabled = true;
  }

  // prev button
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results } = await searchApiData();
    displaySearchResults(results);
    displayPagination();
  });
  // next button
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results } = await searchApiData();
    displaySearchResults(results);
    displayPagination();
  });
}

function init() {
  switch (global.currentPage) {
    case '/index.html':
    case '/':
      displaySlider();
      displayPopularMovie();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/search.html':
      search();
      break;
    case '/shows.html':
      displayPopularTV();
      break;
    case '/shows':
      displayPopularTV();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
  }
  highlight();
}
document.addEventListener('DOMContentLoaded', init);
/* test(); */
