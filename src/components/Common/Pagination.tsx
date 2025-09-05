import React from 'react';
import {
  HStack,
  Button,
  Text,
  VStack,
  Center,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { type PaginationProps } from '../../types/movie.types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
}) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getVisiblePages = (): number[] => {
    const maxVisible = 5;
    const pages: number[] = [];
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showFirstEllipsis = visiblePages[0] > 2;
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Center mb={6}>
      <VStack spacing={4}>
        {/* Page Navigation */}
        <HStack spacing={2}>
          {/* Previous Button */}
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon />}
            onClick={handlePrevious}
            isDisabled={currentPage === 1}
            variant="outline"
            size="sm"
            _hover={{
              bg: 'brand.500',
              color: 'white',
              borderColor: 'brand.500'
            }}
          />
          
          {/* First Page */}
          {showFirstPage && (
            <>
              <Button
                size="sm"
                onClick={() => onPageChange(1)}
                variant="outline"
                _hover={{
                  bg: 'brand.500',
                  color: 'white',
                  borderColor: 'brand.500'
                }}
              >
                1
              </Button>
              {showFirstEllipsis && (
                <Text px={2} color={textColor}>...</Text>
              )}
            </>
          )}
          
          {/* Visible Page Numbers */}
          {visiblePages.map((pageNum) => (
            <Button
              key={pageNum}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
              variant={currentPage === pageNum ? 'solid' : 'outline'}
              _hover={currentPage !== pageNum ? {
                bg: 'brand.500',
                color: 'white',
                borderColor: 'brand.500'
              } : {}}
              fontWeight={currentPage === pageNum ? 'bold' : 'normal'}
            >
              {pageNum}
            </Button>
          ))}
          
          {/* Last Page */}
          {showLastPage && (
            <>
              {showLastEllipsis && (
                <Text px={2} color={textColor}>...</Text>
              )}
              <Button
                size="sm"
                onClick={() => onPageChange(totalPages)}
                variant="outline"
                _hover={{
                  bg: 'brand.500',
                  color: 'white',
                  borderColor: 'brand.500'
                }}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          {/* Next Button */}
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon />}
            onClick={handleNext}
            isDisabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            _hover={{
              bg: 'brand.500',
              color: 'white',
              borderColor: 'brand.500'
            }}
          />
        </HStack>
        
        {/* Page Info */}
        <Text color={textColor} fontSize="sm" textAlign="center">
          Page {currentPage} of {totalPages} • {totalResults.toLocaleString()} movies total
        </Text>
        
        {/* Quick Jump Buttons for larger datasets */}
        {totalPages > 10 && (
          <HStack spacing={2}>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onPageChange(1)}
              isDisabled={currentPage === 1}
              color={textColor}
            >
              First
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onPageChange(Math.max(1, currentPage - 10))}
              isDisabled={currentPage <= 10}
              color={textColor}
            >
              -10
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 10))}
              isDisabled={currentPage > totalPages - 10}
              color={textColor}
            >
              +10
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onPageChange(totalPages)}
              isDisabled={currentPage === totalPages}
              color={textColor}
            >
              Last
            </Button>
          </HStack>
        )}
      </VStack>
    </Center>
  );
};

export default Pagination;