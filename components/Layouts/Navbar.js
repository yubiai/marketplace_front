import {
  Box,
  Flex,
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
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Image
} from "@chakra-ui/react";
import { BsFillBellFill, BsClock } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { BiHappyAlt } from "react-icons/bi";
import { MdMessage, MdOutlineKeyboardArrowUp } from "react-icons/md";

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
              <MenuList>
                <Flex w="200px">
                  <Center w="33%">
                    <Image
                      alt={"Logo"}
                      borderRadius="2xl"
                      width={"3em"}
                      objectFit={"cover"}
                      src={"/static/images/userdefault.png"}
                      fallbackSrc={"/static/images/userdefault.png"}
                    />
                  </Center>
                  <Text>
                    Name User <br />
                    <Flex>
                      <Image
                        alt={"Logo"}
                        width="1em"
                        borderRadius="2xl"
                        objectFit={"cover"}
                        src={"/static/images/logoubi.png"}
                        fallbackSrc={"/static/images/logoubi.png"}
                      />
                      <Text fontSize={"10px"} fontWeight={"bold"}>
                        6801.90 UBI's dripped
                      </Text>
                    </Flex>
                  </Text>
                </Flex>
                <MenuItem command="I">My Info</MenuItem>
                <MenuItem command="O">Orders </MenuItem>
                <MenuItem command="S">Sales</MenuItem>
                <MenuItem command="M">Mailbox</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              {({ onClose }) => (
                <>
                  <MenuButton
                    as={IconButton}
                    aria-label="alert"
                    borderColor={"transparent"}
                    icon={<BsFillBellFill color="white" />}
                    variant="outline"
                    _hover={{ bg: "gray.600", color: "gray.200" }}
                    _expanded={{ bg: "blue.400" }}
                    _focus={{ boxShadow: "outline" }}
                  />
                  <MenuList>
                    <Button
                      bg="transparent"
                      h="2em"
                      float="right"
                      onClick={() => onClose()}
                    >
                      <MdOutlineKeyboardArrowUp />
                    </Button>
                    <MenuItem
                      icon={<BiHappyAlt />}
                      borderBottom={"1px solid #bababa"}
                    >
                      The Englego´s course is in offer
                    </MenuItem>
                    <MenuItem
                      icon={<BsClock />}
                      borderBottom={"1px solid #bababa"}
                    >
                      You´ve 2 days, 45 minutes to confirm the payment
                    </MenuItem>
                    <MenuItem
                      icon={<MdMessage />}
                      borderBottom={"1px solid #bababa"}
                    >
                      You´ve 1 new message
                    </MenuItem>
                    <Center>
                      <Button bg="transparent" color="#00abd1">
                        See more...
                      </Button>
                    </Center>
                  </MenuList>
                </>
              )}
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
