import type { TMDBResponse, ExternalIds } from '../types/movie.types';
import { BASE_URL, IMAGE_BASE_URL, IMDB_URL } from "../constants/tmdb.constants";
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_TMDB_API_KEY is not defined in .env');
}

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

class TMDBApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(status: number, statusText: string) {
    super(`TMDB API Error: ${status} - ${statusText}`);
    this.status = status;
    this.statusText = statusText;
  }
}

// Utility function to handle API errors
const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    const statusText = error.response.data?.status_message || error.response.statusText;
    throw new TMDBApiError(status, statusText);
  }
  throw error;
};

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const { data } = await tmdbClient.get(`/movie/popular?page=${page}`);
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse> => {
    try {
      const { data } = await tmdbClient.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Get movie details (includes IMDB ID)
  getMovieExternalIds: async (movieId: number): Promise<ExternalIds> => {
    try {
      const { data } = await tmdbClient.get(`/movie/${movieId}/external_ids`);
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  // Utility functions for image URLs
  getPosterUrl: (posterPath: string | null, size: string = 'w500'): string => `${IMAGE_BASE_URL}/${size}${posterPath}`,

  getBackdropUrl: (backdropPath: string | null, size: string = 'w1280'): string => `${IMAGE_BASE_URL}/${size}${backdropPath}`,

  getIMDBUrl: (imdbId: string): string => `${IMDB_URL}${imdbId}`
};

export default tmdbApi;