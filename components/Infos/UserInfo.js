import { Center, Flex, Image, Text, Stack, HStack, Box } from '@chakra-ui/react'


const UserInfo = ({ profile, balanceToken, t }) => {


  if (profile) {
    return (
      <HStack>
        <Box w="33%" h="60px">
          <Center>
            <Image
              alt={'Logo'}
              borderRadius="2xl"
              marginTop={'6px'}
              width={'3em'}
              height={'2.8em'}
              objectFit={'cover'}
              src={profile.photo}
              fallbackSrc={"/static/images/userdefault.png"}
            />
          </Center>
        </Box>
        <Box w="66%" h="60px" p="5px">
          <Stack spacing={1}>
            <Text fontSize={'15px'} fontWeight="semibold">{profile && profile.first_name + (" ") + profile.last_name} </Text>
            <Flex>

              {profile.permission === 6 ? (
                <Text color="red.800" fontSize={'10px'} fontWeight="bold">
                  User Test
                </Text>
              ) : (
                <>
                  <Image
                    alt={'Logo'}
                    width="0.8em"
                    borderRadius="2xl"
                    objectFit={'cover'}
                    src={'/static/images/logoubi.png'}
                    fallbackSrc={'/static/images/logoubi.png'}
                  />
                  <Text fontSize={'10px'} fontWeight="bold">
                    {balanceToken} {t("UBI dripped")}
                  </Text>
                </>
              )}

            </Flex>
          </Stack>
        </Box>
      </HStack>
    )
  }
}

export default UserInfo
