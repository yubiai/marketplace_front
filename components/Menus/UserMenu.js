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
          <HStack spacing="1em">
            <Box w="33%" h="60px">
            <Center>
            <Image
              alt={"Logo"}
              borderRadius="2xl"
              marginTop={"6px"}
              width={"3em"}
              objectFit={"cover"}
              src={"/static/images/userdefault.png"}
              fallbackSrc={"/static/images/userdefault.png"}
            />
            </Center>
            </Box>
            <Box w="66%" h="60px" p="5px">
            <Stack spacing={2}>
              <Text fontSize={"15px"}>Roberto Gomez</Text>
              <Flex>
                <Image
                  alt={"Logo"}
                  width="1em"
                  borderRadius="2xl"
                  objectFit={"cover"}
                  src={"/static/images/logoubi.png"}
                  fallbackSrc={"/static/images/logoubi.png"}
                />
                <Text fontSize={"10px"} fontWeight="bold">
                  6801.90 UBI's dripped
                </Text>
              </Flex>
            </Stack>
            </Box>
          </HStack>
          <Center>
            
            
          </Center>
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

/*
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

*/
