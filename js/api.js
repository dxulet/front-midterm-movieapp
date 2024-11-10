import { config } from "./config.js";

export class MovieAPI {
  static async getPopularMovies() {
    try {
      const response = await fetch(
        `${config.BASE_URL}/movie/popular?api_key=${config.API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return data.results.slice(0, 10); // Return top 10 popular movies
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return [];
    }
  }

  static async searchMovies(query) {
    try {
      const response = await fetch(
        `${config.BASE_URL}/search/movie?api_key=${config.API_KEY}&query=${query}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  }

  static async getMovieDetails(movieId) {
    try {
      const [movieDetails, credits] = await Promise.all([
        fetch(
          `${config.BASE_URL}/movie/${movieId}?api_key=${config.API_KEY}`
        ).then((res) => res.json()),
        fetch(
          `${config.BASE_URL}/movie/${movieId}/credits?api_key=${config.API_KEY}`
        ).then((res) => res.json()),
      ]);
      return { ...movieDetails, credits };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  }

  static async getSortedMovies(sortBy) {
    try {
      const response = await fetch(
        `${config.BASE_URL}/discover/movie?api_key=${config.API_KEY}&sort_by=${sortBy}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching sorted movies:", error);
      return [];
    }
  }
}