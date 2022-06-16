import {
  Box,
  Button,
  Container,
  Divider as ChakraDivider,
  Flex,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FooterChat from '../../../components/Mailbox/FooterChat'
import MessagesChat from '../../../components/Mailbox/MessagesChat'
import HeaderChat from '../../../components/Mailbox/HeaderChat'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'
import { channelService } from '../../../services/channelService'
import useUser from '../../../hooks/data/useUser'
import Error from '../../../components/Infos/Error'

const MailBoxs = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const { order_id } = router.query

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/')
      dispatch({
        type: 'AUTHPROFILE',
        payload: null,
      })
    }
  }, [user, loggedOut, router, dispatch])

  const {
    data: channel,
    isLoading,
    isError,
  } = useFetch(
    `/channel/orderid/${order_id}`,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    const initChannel = async () => {
      if (channel) {
        setMessages(channel.messages)
      }
    }
    initChannel()
  }, [channel])

  // Saved Channel

  const saveMessage = async (message) => {
    await channelService
      .pushMsg(channel._id, message, global.profile.token)
      .then(() => {
        setInputMessage('')
      })
      .catch(() => {
        setInputMessage('')
      })
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return
    }
    const data = inputMessage

    let newMessage = {
      user: global.profile._id,
      text: data,
    }

    setMessages((old) => [...old, newMessage])
    saveMessage(newMessage)
  }

  console.log(channel, 'channel')
  console.log(messages, 'messages')

  if (isLoading || !user) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Mailbox</title>
      </Head>

      <Container
        maxW="5xl"
        display={'flex'}
        flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
      >
        <Box w={{ base: 'full', lg: '70%' }} h="900px">
          <Button
            mt="1em"
            backgroundColor={'#00abd1'}
            color={'white'}
            rounded={'full'}
            ml="1em"
            cursor={'pointer'}
            display={{ base: 'none', md: 'flex' }}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Text m="1em">Mailbox the Order ID: {order_id}</Text>
          <Flex w="100%" h="600px" justify="center" align="center" bg="white">
            <Flex w="80%" h="90%" flexDir="column">
              {global && global.profile && (
                <HeaderChat
                  dataUser={
                    global &&
                    global.profile &&
                    global.profile._id !== channel.buyer._id
                      ? channel.buyer || null
                      : channel.seller || null
                  }
                  type={
                    global && global.profile._id !== channel.buyer._id
                      ? 'Buyer'
                      : 'Seller'
                  }
                />
              )}
              <ChakraDivider
                w="100%"
                borderBottomWidth="3px"
                color="black"
                mt="5"
              />
              {global.profile && (
                <MessagesChat
                  messages={messages}
                  buyer={channel.buyer}
                  seller={channel.seller}
                  me={global && global.profile && global.profile._id}
                />
              )}
              <ChakraDivider
                w="100%"
                borderBottomWidth="3px"
                color="black"
                mt="5"
              />
              <FooterChat
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
              />
            </Flex>
          </Flex>
        </Box>
        <Box w={{ base: 'full', lg: '30%' }} p="1em">
          <p></p>
        </Box>
      </Container>
    </>
  )
}

export default MailBoxs
