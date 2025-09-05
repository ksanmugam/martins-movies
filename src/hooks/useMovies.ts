import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../services/tmdbApi';
import type { UseMoviesOptions, TMDBResponse } from '../types/movie.types';

export const useMovies = ({ page, query }: UseMoviesOptions) => {
  return useQuery({
    queryKey: ['movies', page, query],
    queryFn: async (): Promise<TMDBResponse> => {
      if (query.trim()) {
        return tmdbApi.searchMovies(query, page);
      }
      return tmdbApi.getPopularMovies(page);
    },
    refetchOnWindowFocus: false,
  });
};