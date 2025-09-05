import React, { useState, useEffect } from 'react';
import {
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Button,
  HStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

type SearchBarPropsImproved = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
};

const SearchBar: React.FC<SearchBarPropsImproved> = ({
  value,
  onChange,
  onSearch,
  onClear,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.700');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    onClear();
  };

  const showClearButton = inputValue.trim().length > 0;

  return (
    <Box maxW="2xl" mx="auto" w="full">
      <HStack w="full" spacing={2}>
        <InputGroup size="lg" flex="1">
          <InputLeftElement pointerEvents="none">
            {isLoading ? <Spinner size="sm" color="brand.500" /> : <SearchIcon color="gray.400" />}
          </InputLeftElement>

          <Input
            placeholder="Search movies by keyword..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Enter triggers search
            isDisabled={isLoading}
            bg={inputBg}
            borderColor={borderColor}
          />

          {showClearButton && (
            <InputRightElement width="auto" mr={2}>
              <Button
                size="sm"
                onClick={handleClear}
                isDisabled={isLoading}
                leftIcon={<CloseIcon />}
              >
                Clear
              </Button>
            </InputRightElement>
          )}
        </InputGroup>

        <Button
          colorScheme="brand"
          onClick={onSearch}
          size="lg"
          isDisabled={isLoading}
          leftIcon={<SearchIcon />}
        >
          Search
        </Button>
      </HStack>
    </Box>
  );
};

export default SearchBar;
