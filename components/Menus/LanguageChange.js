import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

const LanguageChange = () => {
  const { i18n } = useTranslation("navbar");
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="language"
        rightIcon={<ChevronDownIcon />}
        backgroundColor="transparent"
        color="white"
        ml="1em"
        p={{base: 0, md: "1em"}}
        _hover={{ bg: '#1C538A', color: 'gray.200' }}
        _expanded={{ bg: 'blue.400' }}
        _focus={{ boxShadow: 'outline' }}
        // isDisabled
      >
        EN
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => {i18n.changeLanguage("en")}}>EN</MenuItem>
        <MenuItem onClick={() => {i18n.changeLanguage("es")}}>ES</MenuItem>
        <MenuItem>PT</MenuItem>
        <MenuItem>DE</MenuItem>
        <MenuItem>IT</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageChange;
