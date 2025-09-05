import React, { useCallback, useState } from 'react';
import {
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Badge,
  Button,
  IconButton,
  Flex,
  VStack,
  Box,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { StarIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { type MovieCardProps } from '../../types/movie.types';
import { tmdbApi } from '../../services/tmdbApi';
import { useQueryClient } from '@tanstack/react-query';
import { COMING_SOON_PLACEHOLDERS } from '../../constants/placeholders';

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isWatched,
  onToggleWatched
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const yearColor = useColorModeValue('gray.500', 'gray.400');

  const queryClient = useQueryClient();

  const toast = useToast();

  const [imdbUrl, setImdbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWatchedToggle = () => {
    onToggleWatched(movie.id);
  };

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  };

  const handleReadMoreClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      let url = imdbUrl;

      if (!url) {
        const data = await queryClient.fetchQuery({
          queryKey: ['movie-external-ids', movie.id],
          queryFn: () => tmdbApi.getMovieExternalIds(movie.id),
        });

        if (data?.imdb_id) {
          url = tmdbApi.getIMDBUrl(data.imdb_id);
          setImdbUrl(url);
        } else {
          toast({
            title: 'IMDB link not available',
            description: 'This movie does not have an IMDB ID.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }
      }

      // Open IMDB page
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      toast({
        title: 'No IMDb link available',
        description: 'This movie does nto have an IMDb ID.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    finally {
      setLoading(false);
    }
  }, [imdbUrl, movie, queryClient, toast, loading]);

  const imageUrl = isHovered
    ? movie.backdrop_path
      ? tmdbApi.getBackdropUrl(movie.backdrop_path) // Use backdrop if available
      : COMING_SOON_PLACEHOLDERS.backdrop // Fallback to placeholder
    : movie.poster_path
      ? tmdbApi.getPosterUrl(movie.poster_path) // Default poster
      : COMING_SOON_PLACEHOLDERS.poster;

  return (
    <Card
      bg={cardBg}
      shadow="lg"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        cursor: 'pointer'
      }}
      position="relative"
      h="full"
    >
      {/* Movie Poster */}
      <Box position="relative">
        <Image
          src={imageUrl}
          alt={`${movie.title} ${isHovered ? 'backdrop' : 'poster'}`}
          h="300px"
          w="100%"
          objectFit="cover"
          loading="lazy"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        {/* Watched Toggle Button */}
        <IconButton
          aria-label={isWatched ? "Mark as unwatched" : "Mark as watched"}
          icon={isWatched ? <ViewIcon /> : <ViewOffIcon />}
          size="sm"
          colorScheme={isWatched ? "green" : "gray"}
          position="absolute"
          top={2}
          right={2}
          onClick={handleWatchedToggle}
          bg="blackAlpha.700"
          color="white"
          _hover={{
            bg: isWatched ? "green.500" : "gray.500",
            transform: 'scale(1.1)'
          }}
          zIndex={1}
        />

        {/* Rating Badge */}
        <Badge
          position="absolute"
          bottom={2}
          left={2}
          colorScheme="yellow"
          variant="solid"
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          borderRadius="md"
        >
          <StarIcon boxSize={3} />
          {formatRating(movie.vote_average)}
        </Badge>

        {/* Watched Indicator */}
        {isWatched && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="green"
            variant="solid"
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            borderRadius="md"
          >
            <ViewIcon boxSize={3} />
            Watched
          </Badge>
        )}
      </Box>

      {/* Card Content */}
      <CardBody display="flex" flexDirection="column" flex={1}>
        <VStack align="stretch" spacing={3} flex={1}>
          {/* Movie Title */}
          <Heading
            size="md"
            noOfLines={2}
            title={movie.title}
            minH="3rem"
          >
            {movie.title}
          </Heading>

          {/* Release Year */}
          <Text color={yearColor} fontSize="sm" fontWeight="medium">
            {formatYear(movie.release_date)}
          </Text>

          {/* Overview */}
          <Text
            color={textColor}
            fontSize="sm"
            noOfLines={3}
            flex={1}
            title={movie.overview}
          >
            {movie.overview || 'No description available.'}
          </Text>

          <Flex align="center" justify="space-between" mt="auto" pt={4}>
            {/* Read More Button */}
            <Button
              colorScheme="brand"
              size="sm"
              _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
              onClick={handleReadMoreClick}
              isLoading={loading}
            >
              Read More
            </Button>

            {/* Vote Count */}
            <Text fontSize="xs" color={textColor}>
              {movie.vote_count.toLocaleString()} votes
            </Text>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default MovieCard;