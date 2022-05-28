import React, { useEffect, useRef } from 'react'
import { Avatar, Flex, Text } from '@chakra-ui/react'

const MessagesChat = ({ messages, buyer, seller, me }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView())
    return <div ref={elementRef} />
  }

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        console.log(messages, 'messages')
        if (item.user === me) {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="black"
                color="white"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                <Text>{item.text}</Text>
              </Flex>
            </Flex>
          )
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="User"
                src={buyer._id == me ? seller.photo : buyer.photo}
                bg="blue.300"
              ></Avatar>
              <Flex
                bg="gray.100"
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                <Text>{item.text}</Text>
              </Flex>
            </Flex>
          )
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  )
}

export default MessagesChat
