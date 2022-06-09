import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

const LanguageChange = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="language"
        rightIcon={<ChevronDownIcon />}
        backgroundColor="transparent"
        color="white"
        display={{ base: 'none', md: 'flex' }}
        _hover={{ bg: '#1C538A', color: 'gray.200' }}
        _expanded={{ bg: 'blue.400' }}
        _focus={{ boxShadow: 'outline' }}
        isDisabled
      >
        EN
      </MenuButton>
      <MenuList>
        <MenuItem>EN</MenuItem>
        <MenuItem>ES</MenuItem>
        <MenuItem>PT</MenuItem>
        <MenuItem>DE</MenuItem>
        <MenuItem>IT</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageChange;
