import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
  Fade,
  ScaleFade,
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import MovieCard from './components/Card/MovieCard';
import SearchBar from './components/Common/SearchBar';
import Pagination from './components//Common/Pagination';

import { useMovies } from './hooks/useMovies';
import theme from './theme/chakraTheme';

import { 
  watchedMoviesManager, 
  urlHelpers, 
  validationHelpers,
  errorHelpers 
} from './utils/helpers';

const MoviesContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [watchedMovies, setWatchedMovies] = useState<Set<number>>(new Set());
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const toast = useToast();

  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    isRefetching,
    isFetching 
  } = useMovies({
    page: currentPage,
    query: searchQuery,
  });

  // Load watched movies from storage on mount
  useEffect(() => {
    const saved = watchedMoviesManager.getWatchedMovies();
    setWatchedMovies(saved);
  }, []);

  // Load URL parameters on mount
  useEffect(() => {
    const params = urlHelpers.getSearchParams();
    if (params.page && params.page > 1) {
      setCurrentPage(params.page);
    }
    if (params.query) {
      setSearchQuery(params.query);
      setSearchInput(params.query);
    }
  }, []);

  // Update URL when search params change
  useEffect(() => {
    urlHelpers.updateSearchParams({
      page: currentPage > 1 ? currentPage : null,
      query: searchQuery || null,
    });
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    const sanitizedQuery = validationHelpers.sanitizeSearchQuery(searchInput);
    
    if (sanitizedQuery && !validationHelpers.isValidSearchQuery(sanitizedQuery)) {
      toast({
        title: 'Invalid Search',
        description: 'Search query must be between 1 and 100 characters.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSearchQuery(sanitizedQuery);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    
    toast({
      title: 'Search Cleared',
      description: 'Showing all popular movies.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWatched = (movieId: number) => {
    try {
      const updatedWatchedMovies = watchedMoviesManager.toggleWatchedMovie(movieId);
      setWatchedMovies(new Set(updatedWatchedMovies));
      
      const isWatched = updatedWatchedMovies.has(movieId);
      toast({
        title: isWatched ? 'Added to Watched' : 'Removed from Watched',
        description: isWatched 
          ? 'Movie marked as watched!' 
          : 'Movie unmarked as watched.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      errorHelpers.logError(error, 'Toggle Watched');
      toast({
        title: 'Error',
        description: 'Failed to update watched status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRetry = () => {
    refetch();
    toast({
      title: 'Retrying...',
      description: 'Attempting to reload movies.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };


useEffect(() => {
  if (!isLoading && !isRefetching && !isFetching) {
    setHasLoadedOnce(true); // mark that initial load finished
  }
}, [isLoading, isRefetching, isFetching]);

// Only show loading for subsequent searches/refetches
const isLoadingData = hasLoadedOnce && (isRefetching || isFetching);

  return (
    <Box minH="100vh" bg="gray.900">
      {/* Header */}
      <Box bg="black" py={8} px={4}>
        <Container maxW="7xl">
          <VStack spacing={2}>
            <Fade in>
              <Heading 
                size="2xl" 
                color="brand.500" 
                textAlign="center"
                fontWeight="bold"
                letterSpacing="tight"
              >
                Martin's Movies
              </Heading>
            </Fade>
            <Text color="gray.400" textAlign="center" fontSize="lg">
              Discover and track your favorite movies
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="7xl" py={8} px={4}>
        {/* Search Section */}
        <Box mb={8}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isLoading={isLoadingData}
          />
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Center py={12}>
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text color="gray.400">Loading movies...</Text>
            </VStack>
          </Center>
        )}

        {/* Error State */}
        {error && (
          <ScaleFade in>
            <Alert 
              status="error" 
              mb={6} 
              bg="red.900" 
              border="1px solid" 
              borderColor="red.700"
              borderRadius="lg"
            >
              <AlertIcon />
              <VStack align="start" spacing={2} flex="1">
                <AlertTitle>Failed to load movies!</AlertTitle>
                <AlertDescription>
                  {errorHelpers.getErrorMessage(error)}
                  {errorHelpers.isNetworkError(error) && (
                    <Text fontSize="sm" mt={1}>
                      Please check your internet connection and try again.
                    </Text>
                  )}
                </AlertDescription>
                <Button 
                  colorScheme="red" 
                  size="sm" 
                  onClick={handleRetry}
                  isLoading={isRefetching}
                  loadingText="Retrying..."
                >
                  Try Again
                </Button>
              </VStack>
            </Alert>
          </ScaleFade>
        )}

        {/* Movies Grid */}
        {data && !isLoading && (
          <>
            {/* Results Summary */}
            {searchQuery && (
              <Box mb={6} textAlign="center">
                <Text color="gray.400">
                  Found {data.total_results.toLocaleString()} results for "{searchQuery}"
                </Text>
              </Box>
            )}

            {/* Movie Cards Grid */}
            <Fade in>
              <Grid 
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))" 
                gap={6} 
                mb={8}
              >
                {data.results.map((movie, index) => (
                  <ScaleFade 
                    key={movie.id} 
                    in 
                    delay={index * 0.1}
                    unmountOnExit={false}
                  >
                    <MovieCard
                      movie={movie}
                      key={movie.id}
                      isWatched={watchedMovies.has(movie.id)}
                      onToggleWatched={handleToggleWatched}
                    />
                  </ScaleFade>
                ))}
              </Grid>
            </Fade>

            {/* Pagination */}
            <Fade in>
              <Pagination
                currentPage={currentPage}
                totalPages={data.total_pages > 500 ? 500 : data.total_pages} // TMDB caps at 500
                onPageChange={handlePageChange}
                totalResults={data.total_results}
              />
            </Fade>
          </>
        )}

        {/* Empty State */}
        {data && data.results.length === 0 && !isLoading && (
          <Center py={12}>
            <VStack spacing={4}>
              <Text color="gray.400" fontSize="lg">
                {searchQuery ? 'No movies found' : 'No movies available'}
              </Text>
              <Text color="gray.500" textAlign="center" maxW="md">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all movies'
                  : 'There are currently no movies available to display'
                }
              </Text>
              {searchQuery && (
                <Button colorScheme="brand" onClick={handleClearSearch}>
                  Show All Movies
                </Button>
              )}
            </VStack>
          </Center>
        )}

        {/* Watched Movies Summary */}
        {watchedMovies.size > 0 && (
          <Box mt={8} textAlign="center">
            <Text color="green.400" fontSize="sm">
              You've watched {watchedMovies.size} movie{watchedMovies.size !== 1 ? 's' : ''}
            </Text>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box bg="black" py={6} px={4} mt={16}>
        <Container maxW="7xl">
          <VStack spacing={2}>
            <Text color="gray.400" textAlign="center">
              © 2025 Martin's Movies. All rights reserved.
            </Text>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Powered by The Movie Database (TMDB)
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  // Create QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on client errors (4xx)
          if (error instanceof Error && error.message.includes('4')) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <MoviesContent />
      </ChakraProvider>
      {/* React Query DevTools (only in development) */}
      {import.meta.env.VITE_DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;