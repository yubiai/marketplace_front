import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';

const SearchBar = () => {
  return (
    <>
      <InputGroup backgroundColor={'white'} borderRadius="5px">
        <Input
          variant="filled"
          backgroundColor={'white'}
          focusBorderColor={'transparent'}
          size="md"
          placeholder={`Search in Yubiai Marketplace`}
        />
        <InputRightElement
          color="gray.300"
          pointerEvents="none"
          justifyContent={'left'}
          fontSize="1.4em"
          children={<>|</>}
        />
        <InputRightElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" w={'1.2em'} h={'1.1em'} />}
        />
      </InputGroup>
    </>
  );
};

export default SearchBar;
