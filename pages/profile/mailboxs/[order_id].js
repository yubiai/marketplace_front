import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Center,
  Container,
  Divider as ChakraDivider,
  Flex,
  Heading,
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
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { itemService } from '../../../services/itemService'
import ItemCard from '../../../components/Cards/ItemCard'
import StatusOrder from '../../../components/Infos/StatusOrder'

const MailBoxs = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const { order_id } = router.query

  const [item, setItem] = useState(null)

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

  const {
    data: channel,
    isLoading,
    isError,
  } = useFetch(
    global && global.profile && global.profile.token && order_id
      ? `/channel/orderid/${order_id}`
      : null,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    const initChannel = async () => {
      if (channel) {
        setMessages(channel.messages);

        await itemService.getItemById(channel && channel.order_id && channel.order_id.itemId, global && global.profile?.token)
          .then((res) => {
            setItem(res.data)
          })
          .catch((err) => {
            console.error(err)
          })
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

  if (isLoading || !user || !channel) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  console.log(channel, "channel")

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Mailbox</title>
      </Head>

      <Container
        maxW="5xl"
        display={'flex'}
        flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
        h={{ base: 'full', md: '90vh' }}
      >
        <Box w={{ base: 'full', lg: '70%' }}>
          <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href="/" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>Home</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/profile/orders/detail/${channel.order_id.transactionHash}`}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>Order detail</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Mailbox the order # {channel.order_id._id}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Flex w="100%" h="600px" justify="center" align="center" bg="white" mt="1em">
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
              <Flex>
              <FooterChat
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
              />
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box w={{ base: 'full', lg: '30%' }} p="1em">

          <Center><Heading size="md">Item</Heading></Center>

          {item && (
            <ItemCard item={item} />

          )}
          <Center mt="1em"> {channel.order_id && channel.order_id.status && (
            StatusOrder(channel.order_id.status)
          )}</Center>

        </Box>
      </Container>
    </>
  )
}

export default MailBoxs
