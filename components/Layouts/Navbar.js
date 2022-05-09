import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  Center,
  Container,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

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
          <Flex>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
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
