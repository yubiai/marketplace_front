import {
  Box,
  Container,
  Divider as ChakraDivider,
  Flex,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FooterChat from '../../../components/Mailbox/FooterChat'
import HeaderChat from '../../../components/Mailbox/HeaderChat'
import MessagesChat from '../../../components/Mailbox/MessagesChat'
import Loading from '../../../components/Spinners/Loading'
import { useGlobal } from '../../../providers/globalProvider'
import { channelService } from '../../../services/channelService'

const MailBoxs = () => {
  const global = useGlobal()
  const router = useRouter()
  const { order_id } = router.query

  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  // Get Channel
  const getChannel = async () => {
    await channelService
      .getChannelByOrderId(order_id)
      .then((res) => {
        let channel = res.data.result
        if (channel) {
          setChannel(channel)
          setMessages(channel.messages)
        }
        return true
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    const initChannel = async () => {
      console.log(order_id)
      console.log(global.profile)
      if (global && global.profile) {
        // Get Channel
        getChannel(order_id)
      } else {
        router.push('/')
      }
    }
    initChannel()
  }, [global])

  // Saved Channel

  const saveMessage = async (message) => {
    await channelService
      .pushMsg(channel._id, message)
      .then((res) => {
        console.log(res.data)
        setInputMessage('')
      })
      .catch((err) => {
        console.log(err)
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

  if (!channel) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Mailbox</title>
      </Head>

      <Container maxW="5xl" display={'flex'} flexDirection={'row'}>
        <Box w="70%" h="90vh">
          <Text m="1em">Mailbox the Order ID: {order_id}</Text>
          <Flex
            w="100%"
            h="600px"
            justify="center"
            align="center"
            bg="white"
          >
            <Flex w="80%" h="90%" flexDir="column">
              <HeaderChat
                dataUser={
                  global && global.profile._id !== channel.buyer._id
                    ? channel.buyer
                    : channel.seller
                }
                type={
                  global && global.profile._id !== channel.buyer._id
                    ? 'Buyer'
                    : 'Seller'
                }
              />
              <ChakraDivider
                w="100%"
                borderBottomWidth="3px"
                color="black"
                mt="5"
              />
              <MessagesChat
                messages={messages}
                buyer={channel.buyer}
                seller={channel.seller}
                me={global && global.profile && global.profile._id}
              />
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
        <Box w="30%" p="1em">
          <p>Payment waiting on escrow</p>
        </Box>
      </Container>
    </>
  )
}

export default MailBoxs
