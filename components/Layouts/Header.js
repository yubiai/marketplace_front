import Link from "next/link";
import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  useColorModeValue,
  Show,
  Center,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import LenguageChange from "../Menus/LenguageChange";
import DrawerMenu from "../Menus/DrawerMenu";

const Header = () => {
  return (
    <Box
      bg={useColorModeValue("yb.1", "gray.900")}
      px={{ base: "full", md: 4 }}
    >
      <Container maxW="container.xl">
        <Flex
          h={{ base: "100px", md: "16" }}
          alignItems={"center"}
          justifyContent={{ base: "center", md: "center", lg: "space-between" }}
        >
          {/* Logo */}
          <Box width={{ md: "6em" }}>
            <Link href={"/"}>
              <Image
                alt={"Logo"}
                objectFit={"cover"}
                display={{ base: "none", md: "flex" }}
                src={"/static/images/logoyubiai.png"}
                fallbackSrc={"/static/images/logoyubiai.png"}
              />
            </Link>
          </Box>

          {/* Search */}
          <Center w={"md"}>
            <InputGroup backgroundColor={"white"} borderRadius="5px">
              <Input
                variant="filled"
                backgroundColor={"white"}
                focusBorderColor={"transparent"}
                size="md"
                placeholder={`Search in Yubiai Marketplace`}
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

          {/* Lenguage */}
          <LenguageChange />
          <Button
            backgroundColor={"white"}
            color={"#00abd1"}
            rounded={"full"}
            cursor={"pointer"}
            display={{ base: "none", md: "flex" }}
          >
            Connect
          </Button>
          <Show below='md'>
            <DrawerMenu />
          </Show>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
