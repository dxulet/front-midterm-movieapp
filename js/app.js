import { MovieAPI } from "./api.js";
import { MovieCard } from "./movieCard.js";
import { Modal } from "./modal.js";

class MovieApp {
  constructor() {
    this.movies = [];
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    this.isWatchlistView = false;
    this.currentSort = "popularity.desc";
    this.modal = new Modal();

    this.setupElements();
    this.setupEventListeners();
    this.init();
  }

  setupElements() {
    this.searchInput = document.querySelector(".search-input");
    this.suggestionsContainer = document.querySelector(".search-suggestions");
    this.sortSelect = document.querySelector(".sort-select");
    this.watchlistToggle = document.querySelector(".watchlist-toggle");
    this.movieGrid = document.querySelector(".movie-grid");
  }

  setupEventListeners() {
    // Existing event listeners
    this.searchInput.addEventListener(
      "input",
      this.debounce(this.handleSearch.bind(this), 500)
    );
    this.sortSelect.addEventListener("change", this.handleSort.bind(this));
    this.watchlistToggle.addEventListener(
      "click",
      this.toggleWatchlistView.bind(this)
    );
    this.movieGrid.addEventListener("click", this.handleMovieClick.bind(this));

    this.suggestionsContainer.addEventListener(
      "click",
      this.handleSuggestionClick.bind(this)
    );

    document.addEventListener("click", (e) => {
      if (
        !this.suggestionsContainer.contains(e.target) &&
        e.target !== this.searchInput
      ) {
        this.suggestionsContainer.style.display = "none";
      }
    });
  }

  async init() {
    const popularMovies = await MovieAPI.getPopularMovies();
    this.movies = popularMovies;
    this.renderMovies();
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  async handleSearch(e) {
    const searchTerm = e.target.value.trim();

    if (searchTerm.length < 2) {
      this.suggestionsContainer.style.display = "none";
      return;
    }

    const searchResults = await MovieAPI.searchMovies(searchTerm);
    this.movies = searchResults;

    // Show suggestions
    // Show suggestions
    this.suggestionsContainer.innerHTML = searchResults
      .slice(0, 5)
      .map(
        (movie) => `
    <div class="suggestion-item" data-id="${movie.id}">
      ${movie.title} (${movie.release_date?.split("-")[0] || "N/A"})
    </div>
  `
      )
      .join("");

    this.suggestionsContainer.style.display = "block";
    this.renderMovies();
  }

  async handleSuggestionClick(e) {
    const suggestionItem = e.target.closest(".suggestion-item");
    if (!suggestionItem) return;

    const movieId = suggestionItem.dataset.id;
    const movieDetails = await MovieAPI.getMovieDetails(movieId);

    if (movieDetails) {
      const isInWatchlist = this.watchlist.some(
        (m) => m.id === movieDetails.id
      );
      const detailContent = MovieCard.createDetailView(
        movieDetails,
        isInWatchlist
      );
      this.modal.show(detailContent);

      const watchlistBtn = document.querySelector(
        ".modal-content .watchlist-toggle"
      );
      watchlistBtn.addEventListener("click", () =>
        this.toggleWatchlist(movieDetails)
      );

      this.searchInput.value = movieDetails.title;
    }

    this.suggestionsContainer.style.display = "none";
  }

  async handleSort(e) {
    this.currentSort = e.target.value;
    const sortedMovies = await MovieAPI.getSortedMovies(this.currentSort);
    this.movies = sortedMovies;
    this.renderMovies();
  }

  toggleWatchlistView() {
    this.isWatchlistView = !this.isWatchlistView;
    this.watchlistToggle.textContent = this.isWatchlistView
      ? "View All Movies"
      : "View Watchlist";
    this.renderMovies();
  }

  async handleMovieClick(e) {
    const movieCard = e.target.closest(".movie-card");
    if (!movieCard) return;

    const movieId = movieCard.dataset.id;
    const movieDetails = await MovieAPI.getMovieDetails(movieId);

    if (movieDetails) {
      const isInWatchlist = this.watchlist.some(
        (m) => m.id === movieDetails.id
      );
      const detailContent = MovieCard.createDetailView(
        movieDetails,
        isInWatchlist
      );
      this.modal.show(detailContent);

      // Add event listener for watchlist toggle in modal
      const watchlistBtn = document.querySelector(
        ".modal-content .watchlist-toggle"
      );
      watchlistBtn.addEventListener("click", () =>
        this.toggleWatchlist(movieDetails)
      );
    }
  }

  toggleWatchlist(movie) {
    const index = this.watchlist.findIndex((m) => m.id === movie.id);

    if (index === -1) {
      this.watchlist.push(movie);
    } else {
      this.watchlist.splice(index, 1);
    }

    localStorage.setItem("watchlist", JSON.stringify(this.watchlist));
    this.renderMovies();

    // Update modal button if it exists
    const modalWatchlistBtn = document.querySelector(
      ".modal-content .watchlist-toggle"
    );
    if (modalWatchlistBtn) {
      const isInWatchlist = this.watchlist.some((m) => m.id === movie.id);
      modalWatchlistBtn.textContent = isInWatchlist
        ? "Remove from Watchlist"
        : "Add to Watchlist";
    }
  }

  renderMovies() {
    const moviesToRender = this.isWatchlistView ? this.watchlist : this.movies;
    this.movieGrid.innerHTML = moviesToRender
      .map((movie) =>
        MovieCard.create(
          movie,
          this.watchlist.some((m) => m.id === movie.id)
        )
      )
      .join("");
  }
}

// Initialize the app
const movieApp = new MovieApp();
