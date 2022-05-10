import {
  Box,
  Flex,
  HStack,
  Link,
  Container,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack
} from "@chakra-ui/react";
import UserAlerts from "../Menus/UserAlerts";
import UserMenu from "../Menus/UserMenu";

const Links = ["Sell", "Browsing history", "Watch List", "Help Desk"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      color: "gray.300",
      bg: "transparent"
    }}
    href={"#"}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue("yb.1", "gray.900")} px={4}>
      <Container maxW="container.xl">
        <Flex h={16} justifyContent={"space-between"}>
          <HStack
            spacing={8}
            alignItems={"center"}
            w={"90%"}
            justifyContent="center"
          >
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              color="white"
              fontWeight={"bold"}
            >
              <Menu>
                <MenuButton
                  as={Button}
                  variant={"link"}
                  color="white"
                  fontWeight={"bold"}
                  px={2}
                  py={1}
                  mb={"2px"}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: "transparent"
                  }}
                  cursor={"pointer"}
                  minW={0}
                >
                  Categories
                </MenuButton>
                <MenuList>
                  <MenuItem color="black">Services</MenuItem>
                </MenuList>
              </Menu>
              {Links.map(link => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex mt="1em">
            <UserMenu />
            <UserAlerts />
            
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(link => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default Navbar;
