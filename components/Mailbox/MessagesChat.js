import React, { useEffect, useRef } from 'react'
import { Avatar, Box, Center, Flex, Text } from '@chakra-ui/react'
import moment from 'moment'

const MessagesChat = ({ messages, buyer, seller, me }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView())
    return <div ref={elementRef} />
  }

  const dates = new Set()

  const renderDate = (date, dateNum) => {
    const timestampDate = moment(date).format('MMMM Do YYYY')

    // Add to Set so it does not render again
    dates.add(dateNum)

    return (
      <Center>
        <Text fontWeight={"bold"}>{timestampDate}</Text>
      </Center>
    )
  }

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        const dateNum = moment(item.date).format('MMMM Do YYYY')

        if (item.user === me) {
          return (
            <>
              {dates.has(dateNum) ? null : renderDate(item.date, dateNum)}

              <Flex key={index} w="100%" justify="flex-end">
                <Box
                  bg="black"
                  color="white"
                  minW="100px"
                  maxW="350px"
                  my="1"
                  p="3"
                >
                  <Box>{item.text}</Box>
                  <Box>{moment(item.date).format('h:mm a')}</Box>
                </Box>
              </Flex>
            </>
          )
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="User"
                src={buyer._id == me ? seller.photo : buyer.photo}
                bg="blue.300"
              ></Avatar>
              <Box
                bg="gray.100"
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                <Box>{item.text}</Box>
                <Box>{moment(item.date).format('h:mm a')}</Box>
              </Box>
            </Flex>
          )
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  )
}

export default MessagesChat
