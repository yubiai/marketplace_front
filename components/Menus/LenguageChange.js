import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

const LenguageChange = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="lenguage"
        rightIcon={<ChevronDownIcon />}
        backgroundColor="transparent"
        color="white"
        _hover={{ bg: "gray.600", color: "gray.200" }}
        _expanded={{ bg: "blue.400" }}
        _focus={{ boxShadow: "outline" }}
      >
        EN
      </MenuButton>
      <MenuList>
        <MenuItem>EN</MenuItem>
        <MenuItem>ES</MenuItem>
        <MenuItem>PR</MenuItem>
        <MenuItem>AL</MenuItem>
        <MenuItem>IT</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LenguageChange;
