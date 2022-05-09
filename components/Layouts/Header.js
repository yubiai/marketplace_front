import {
  Box,
  Flex,
  Link,
  Button,
  Container,
  Image,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  ChevronDownIcon
} from "@chakra-ui/icons";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue("yb.1", "gray.900")} px={4}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* Logo */}
          <Box width={"6em"}>
            <Image
              alt={"Logo"}
              objectFit={"cover"}
              src={"/static/images/logoyubiai.png"}
              fallbackSrc={"/static/images/logoyubiai.png"}
            />
          </Box>

          {/* Search */}
          <Center w={"md"}>
            <InputGroup backgroundColor={"white"} borderRadius="5px">
              <Input
                variant="filled"
                backgroundColor={"white"}
                focusBorderColor={"transparent"}
                size="md"
                placeholder={`Search for items, categories or sellers`}
              />
              <InputRightElement
                color="gray.300"
                pointerEvents="none"
                justifyContent={"left"}
                fontSize="1.4em"
                children={<>|</>}
              />
              <InputRightElement
                pointerEvents="none"
                children={
                  <SearchIcon color="gray.300" w={"1.2em"} h={"1.1em"} />
                }
              />
            </InputGroup>
          </Center>

          {/* Connect */}
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  backgroundColor="transparent"
                  color="white"
                  _hover={{ bg: "gray.600", color: "gray.200" }}
                  _expanded={{ bg: 'blue.400' }}
                  _focus={{ boxShadow: 'outline' }}
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

              <Button
                backgroundColor={"white"}
                padding={"7px 18px"}
                color={"#00abd1"}
                rounded={"full"}
                cursor={"pointer"}
                variant={"link"}
                minW={0}
              >
                Connect
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
