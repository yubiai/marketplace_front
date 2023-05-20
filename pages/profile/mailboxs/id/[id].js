import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Divider as ChakraDivider,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FooterChat from '../../../../components/Mailbox/FooterChat'
import MessagesChat from '../../../../components/Mailbox/MessagesChat'
import HeaderChat from '../../../../components/Mailbox/HeaderChat'
import Loading from '../../../../components/Spinners/Loading'
import useFetch from '../../../../hooks/data/useFetch'
import { useDispatchGlobal, useGlobal } from '../../../../providers/globalProvider'
import { setYubiaiInstance } from '../../../../providers/orderProvider'
import { channelService } from '../../../../services/channelService'
import useUser from '../../../../hooks/data/useUser'
import Error from '../../../../components/Infos/Error'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation';

const MailBoxByOrderId = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const { id } = router.query

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [previewFiles, setPreviewFiles] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  //const [deal, setDeal] = useState(null);
  const { t } = useTranslation("orders");
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
    global && global.profile && global.profile.token && id
      ? `/channel/${id}`
      : null,
    global && global.profile && global.profile.token
  )

  /*  const loadItem = async () => {
     const result = await orderService.getOrderByOrderId(order_id, global.profile?.token);
     const data = result.data.result;
      const fullStatus = await global.yubiaiPaymentArbitrableInstance.getFullStatusOfDeal(data.transaction.transactionIndex);
     setDeal(fullStatus); 
   } */

  const refreshMessages = async () => {
    await channelService.getChannelByOrderId(channel && channel.order_id && channel.order_id._id, global && global.profile.token)
      .then((res) => {
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (!global.yubiaiPaymentArbitrableInstance) {
      setYubiaiInstance(dispatch);
      return;
    }

    if (channel) {
      setMessages(channel.messages);
      //loadItem();
    }
  }, [channel, global.profile, global.yubiaiPaymentArbitrableInstance])

  // Saved Message
  const saveMessage = async (message) => {
    await channelService
      .pushMsg(channel._id, message, global.profile.token)
      .then(() => {
        setInputMessage('')
        refreshMessages()
      })
      .catch(() => {
        setInputMessage('')
      })
  }

  const saveMessageWithFiles = async (message) => {
    await channelService
      .pushMsgWithFiles(channel._id, message, global.profile.token)
      .then(() => {
        setPreviewFiles([])
        setTimeout(() => {
          setLoadingSubmit(false)
          refreshMessages()
        }, 2000);
      })
      .catch(() => {
        setPreviewFiles([])
        setLoadingSubmit(false)
      })
  }

  const handleSendMessage = async () => {

    if (inputMessage.trim().length > 0) {
      const data = inputMessage

      let newMessage = {
        user: global.profile._id,
        user_eth_address: global.profile.eth_address,
        text: data,
      }

      setInputMessage('')
      setMessages((old) => [...old, newMessage])
      saveMessage(newMessage)
    }

    if (previewFiles.length > 0) {
      setLoadingSubmit(true)

      const form = new FormData()

      for (const file of previewFiles) {
        form.append('files', file.data)
      }

      form.append('user', global.profile._id);
      form.append('user_eth_address', global.profile.eth_address);

      saveMessageWithFiles(form)
    }

    return

  }

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading || !channel || !user) return <Loading />

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
        h={{ base: 'full', md: 'full' }}
      >
        <Box w={{ base: 'full', lg: '70%' }}>
          <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href="/" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>{t("Home")}</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>{t("Profile")}</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile/mailboxs" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>Mailboxs</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Chat</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Flex w="100%" h="700px" justify="center" align="center" bg="white" mt="1em">
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
                      ? t('Buyer ')
                      : t('Seller ')
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
                  previewFiles={previewFiles}
                  setPreviewFiles={setPreviewFiles}
                  handleSendMessage={handleSendMessage}
                  loadingSubmit={loadingSubmit}
                  orderStatus={channel.order_id && channel.order_id.status ? channel.order_id.status : null}
                  t={t}
                />
              </Flex>
            </Flex>
          </Flex>
          <Text fontStyle={"italic"} color="red" mt="1em" >{t("Sensitive")}</Text>
        </Box>
        <Box w={{ base: 'full', lg: '30%' }} m="5px" p="1em" >

          {channel.order_id && channel.order_id.transactionHash ? (
            <Link href={global &&
              global.profile &&
              global.profile._id !== channel.buyer._id ? `/profile/orders/as-seller/${channel.order_id.transactionHash}` : `/profile/orders/detail/${channel.order_id.transactionHash}`} cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
              <Button mt="2em" w="100%" color={'white'} backgroundColor={'#00abd1'} _hover={{
                bg: "blue.400"
              }}>Order</Button>
            </Link>
          ) : (
            <Button mt="2em" w="100%" color={'white'} isDisabled="true" backgroundColor={'#00abd1'} _hover={{
              bg: "blue.400"
            }}>No existe la order</Button>
          )}
        </Box>
      </Container>
    </>
  )
}

export default MailBoxByOrderId;
