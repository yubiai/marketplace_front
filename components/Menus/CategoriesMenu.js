import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";

const CategoriesMenu = () => {
  const { t } = useTranslation("categories");
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
        {t("Categories")}
      </MenuButton>
      <MenuList>
        <MenuItem color="black">
          <Link href={'/category/services'}>{t("Services")}</Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CategoriesMenu;
