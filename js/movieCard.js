import { config } from "./config.js";

export class MovieCard {
  static create(movie, isInWatchlist) {
    return `
            <div class="movie-card" data-id="${movie.id}">
                ${
                  isInWatchlist
                    ? '<div class="watchlist-badge">In Watchlist</div>'
                    : ""
                }
                <img 
                    class="movie-poster" 
                    src="${
                      movie.poster_path
                        ? `${config.IMAGE_BASE_URL}/w500${movie.poster_path}`
                        : "/img/placeholder.png"
                    }"
                    alt="${movie.title}"
                >
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-date">${
                      movie.release_date?.split("-")[0] || "N/A"
                    }</p>
                    <p class="movie-rating">⭐ ${movie.vote_average.toFixed(
                      1
                    )}</p>
                </div>
            </div>
        `;
  }

  static createDetailView(movie, isInWatchlist) {
    return `
        <div class="detail-view-container" style="position: relative; overflow: hidden;">
            <!-- Blurred Background Image -->
            <div class="background-container" style="
                background-image: url('${
                  movie.poster_path
                    ? `${config.IMAGE_BASE_URL}/w500${movie.poster_path}`
                    : "/img/placeholder.png"
                }');
                "></div>

            <!-- Content Container -->
            <div class="content-container">
                <!-- Glass Effect (Optional) -->
                <div class="glass-effect">
                    <!-- Modal Poster -->
                    <div class="modal-poster-container" style="text-align: center;">
                        <img 
                            class="modal-poster"
                            src="${
                              movie.poster_path
                                ? `${config.IMAGE_BASE_URL}/w500${movie.poster_path}`
                                : "/img/placeholder.png"
                            }"
                            alt="${movie.title}"
                            style="max-width: 300px; width: 100%; border-radius: 8px;"
                        >
                    </div>
                    <!-- Modal Details -->
                    <div class="modal-details" style="color: #fff;">
                        <h2>${movie.title} (${
      movie.release_date?.split("-")[0] || "N/A"
    })</h2>
                        <p style="margin: 1rem 0;">
                            ⭐ ${movie.vote_average.toFixed(1)} | 
                            ${Math.floor(movie.runtime / 60)}h ${
      movie.runtime % 60
    }m
                        </p>
                        <button 
                            class="watchlist-toggle" 
                            data-movie-id="${movie.id}"
                            style="margin-bottom: 1rem;"
                        >
                            ${
                              isInWatchlist
                                ? "Remove from Watchlist"
                                : "Add to Watchlist"
                            }
                        </button>
                        <h3>Overview</h3>
                        <p style="margin: 0.5rem 0;">${movie.overview}</p>
                        <h3 style="margin-top: 1rem;">Cast</h3>
                        <div class="cast-grid">
                            ${movie.credits.cast
                              .slice(0, 6)
                              .map(
                                (actor) => `
                                <div class="cast-card">
                                    <img 
                                        class="cast-image"
                                        src="${
                                          actor.profile_path
                                            ? `${config.IMAGE_BASE_URL}/w185${actor.profile_path}`
                                            : "/img/person-placeholder.webp"
                                        }"
                                        alt="${actor.name}"
                                    >
                                    <p style="margin-top: 0.5rem;">${
                                      actor.name
                                    }</p>
                                    <p style="font-size: 0.8rem; color: #ccc;">${
                                      actor.character
                                    }</p>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }
}
