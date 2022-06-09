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
import useFetch from '../../../hooks/data/useFetch'
import { useGlobal } from '../../../providers/globalProvider'
import { channelService } from '../../../services/channelService'

const MailBoxs = () => {
  const global = useGlobal()
  const router = useRouter()
  const { order_id } = router.query

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  const {
    data: channel,
    loading,
    error,
  } = useFetch(
    `/channel/orderid/${order_id}`
  )

  useEffect(() => {
    const initChannel = async () => {
      if(channel){
        setMessages(channel.messages)
      }
    }
    initChannel()
  }, [channel])

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

  if (loading) return <Loading />
  if (error) throw error

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Mailbox</title>
      </Head>

      <Container maxW="5xl" display={'flex'} flexDirection={{base: 'column', md: 'column', lg: 'row'}}>
        <Box w={{base: 'full', lg: '70%'}} h="900px">
          <Text m="1em">Mailbox the Order ID: {order_id}</Text>
          <Flex
            w="100%"
            h="600px"
            justify="center"
            align="center"
            bg="white"
          >
            <Flex w="80%" h="90%" flexDir="column">
              {global && global.profile && (
                <HeaderChat
                dataUser={
                  global && global.profile && global.profile._id !== channel.buyer._id
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
        <Box w={{base: 'full', lg: '30%'}} p="1em">
          <p>Payment waiting on escrow</p>
        </Box>
      </Container>
    </>
  )
}

export default MailBoxs
