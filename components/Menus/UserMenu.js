import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Button,
  Center,
  Flex,
  Image,
  Text,
  Portal,
  Stack,
  HStack,
  Box
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import UserInfo from "../Infos/userInfo";

const UserMenu = () => {
  return (
    <Menu mr="1em">
      <MenuButton
        as={IconButton}
        mr="10px"
        aria-label="Options"
        borderColor={"transparent"}
        icon={<FaUserCircle color="white" />}
        variant="outline"
        _hover={{ bg: "gray.600", color: "gray.200" }}
        _expanded={{ bg: "blue.400" }}
        _focus={{ boxShadow: "outline" }}
      />
      <Portal>
        <MenuList>
          <UserInfo />
          <MenuItem>My Info</MenuItem>
          <MenuItem>Orders </MenuItem>
          <MenuItem>Sales</MenuItem>
          <MenuItem>Mailbox</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default UserMenu;



