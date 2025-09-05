import { type WatchedMovie } from '../types/movie.types';

// Local Storage helpers (fallback to memory if localStorage fails)
class StorageManager {
  private memoryStorage: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        this.memoryStorage.set(key, value);
      }
    } catch (error) {
      console.warn('Storage failed, using memory fallback:', error);
      this.memoryStorage.set(key, value);
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        return this.memoryStorage.get(key) || null;
      }
    } catch (error) {
      console.warn('Storage read failed, using memory fallback:', error);
      return this.memoryStorage.get(key) || null;
    }
  }

  removeItem(key: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        this.memoryStorage.delete(key);
      }
    } catch (error) {
      console.warn('Storage removal failed:', error);
      this.memoryStorage.delete(key);
    }
  }
}

const storage = new StorageManager();

// Watched Movies Management
export const watchedMoviesManager = {
  STORAGE_KEY: 'martins_movies_watched',

  getWatchedMovies(): Set<number> {
    try {
      const stored = storage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed: WatchedMovie[] = JSON.parse(stored);
        return new Set(parsed.map(movie => movie.id));
      }
    } catch (error) {
      console.error('Error loading watched movies:', error);
    }
    return new Set<number>();
  },

  addWatchedMovie(movieId: number): Set<number> {
    const watchedMovies = this.getWatchedMovies();
    watchedMovies.add(movieId);
    this.saveWatchedMovies(watchedMovies);
    return watchedMovies;
  },

  removeWatchedMovie(movieId: number): Set<number> {
    const watchedMovies = this.getWatchedMovies();
    watchedMovies.delete(movieId);
    this.saveWatchedMovies(watchedMovies);
    return watchedMovies;
  },

  toggleWatchedMovie(movieId: number): Set<number> {
    const watchedMovies = this.getWatchedMovies();
    if (watchedMovies.has(movieId)) {
      return this.removeWatchedMovie(movieId);
    } else {
      return this.addWatchedMovie(movieId);
    }
  },

  saveWatchedMovies(watchedMovies: Set<number>): void {
    try {
      const watchedMoviesArray: WatchedMovie[] = Array.from(watchedMovies).map(id => ({
        id,
        watchedAt: new Date().toISOString(),
      }));
      storage.setItem(this.STORAGE_KEY, JSON.stringify(watchedMoviesArray));
    } catch (error) {
      console.error('Error saving watched movies:', error);
    }
  },

  clearWatchedMovies(): void {
    storage.removeItem(this.STORAGE_KEY);
  },
};

// URL Parameter Helpers
export const urlHelpers = {
  updateSearchParams(params: Record<string, string | number | null>) {
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value.toString());
      }
    });

    window.history.replaceState({}, '', url.toString());
  },

  getSearchParam(param: string): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  },

  getSearchParams(): { page?: number; query?: string } {
    const page = this.getSearchParam('page');
    const query = this.getSearchParam('query');

    return {
      page: page ? parseInt(page, 10) : undefined,
      query: query || undefined,
    };
  },
};

// Format Helpers
export const formatHelpers = {
  formatDate(dateString: string, locale: string = 'en-US'): string {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  },

  formatYear(dateString: string): string {
    if (!dateString) return 'Unknown';
    
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'Unknown';
    }
  },

  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  formatVoteCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  },

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  },

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
};

// Validation Helpers
export const validationHelpers = {
  isValidYear(year: string | number): boolean {
    const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
    const currentYear = new Date().getFullYear();
    return yearNum >= 1888 && yearNum <= currentYear + 5; // Cinema started around 1888
  },

  isValidRating(rating: number): boolean {
    return rating >= 0 && rating <= 10;
  },

  isValidSearchQuery(query: string): boolean {
    return query.trim().length >= 1 && query.trim().length <= 100;
  },

  sanitizeSearchQuery(query: string): string {
    return query.trim().replace(/[<>]/g, ''); // Basic XSS protection
  },
};

// Error Helpers
export const errorHelpers = {
  isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.toLowerCase().includes('network') ||
             error.message.toLowerCase().includes('fetch');
    }
    return false;
  },

  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  },

  logError(error: unknown, context?: string): void {
    console.error(`${context ? `[${context}] ` : ''}Error:`, error);
  },
};