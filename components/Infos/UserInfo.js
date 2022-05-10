import {
  Center,
  Flex,
  Image,
  Text,
  Stack,
  HStack,
  Box
} from "@chakra-ui/react";

const UserInfo = () => {
  return (
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
            <Text fontSize={"5px"} fontWeight="bold">
              6801.90 UBI's dripped
            </Text>
          </Flex>
        </Stack>
      </Box>
    </HStack>
  );
};

export default UserInfo;
