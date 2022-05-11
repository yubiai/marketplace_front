import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import Link from 'next/link';

const CategoriesMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant={'link'}
        color="white"
        fontWeight={'bold'}
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: 'transparent'
        }}
        cursor={'pointer'}
        minW={0}
      >
        Categories
      </MenuButton>
      <MenuList>
        <MenuItem color="black">
          <Link href={'/category/services'}>Services</Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CategoriesMenu;
