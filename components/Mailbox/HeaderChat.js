import { Flex, Avatar, Text } from '@chakra-ui/react'

const HeaderChat = ({ dataUser, type }) => {
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  return (
    <Flex w="100%">
      <Avatar size="lg" name={dataUser && dataUser.name} src={url_fleek + dataUser.photo}>
        {/*         <AvatarBadge boxSize="1.25em" bg="green.500" />
         */}
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          {dataUser && dataUser.name}
        </Text>
        <Text color="green.500">{type}</Text>
      </Flex>
    </Flex>
  )
}

export default HeaderChat
