import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Divider as ChakraDivider,
  Flex,
  Text,
  Button,
  Alert,
  AlertIcon,
  useToast,
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
import { channelService } from '../../../../services/channelService'
import useUser from '../../../../hooks/data/useUser'
import Error from '../../../../components/Infos/Error'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation';
import BuyConfigCard from '../../../../components/Cards/BuyConfigCard'

const MailBoxByOrderId = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const toast = useToast();

  const { id } = router.query

  const [inputMessage, setInputMessage] = useState('')
  const [previewFiles, setPreviewFiles] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
    isError,
    isLoading,
    mutate
  } = useFetch(
    global && global.profile && global.profile.token && id
      ? `/channel/${id}`
      : null,
    global && global.profile && global.profile.token
  )

  // Saved Message
  const saveMessage = async (message) => {
    await channelService
      .pushMsg(channel._id, message, global.profile.token)
      .then(() => {
        setInputMessage('');
        mutate()
        setTimeout(() => {
          setLoadingSubmit(false)
        }, 2000);
      })
      .catch(() => {
        setInputMessage('')
        setLoadingSubmit(false)
        mutate()
      })
  }

  const saveMessageWithFiles = async (message) => {
    await channelService
      .pushMsgWithFiles(channel._id, message, global.profile.token)
      .then(() => {
        setPreviewFiles([])
        mutate()
        setTimeout(() => {
          setLoadingSubmit(false)
        }, 2000);
      })
      .catch(() => {
        setPreviewFiles([])
        setLoadingSubmit(false)
        mutate()
      })
  }

  const updateStatusChannel = async (status) => {

    try {
      await channelService.updateStatus({
        _id: channel._id,
        status: status
      }, global?.profile?.token);
      mutate();
      setTimeout(() => {
        toast({
          title: 'Channel',
          description: 'Update Status',
          position: 'top-right',
          status: 'warning',
          duration: 2000,
          isClosable: true
        })
      }, 2000);
      return
    } catch (error) {
      console.error(error);
      return
    }
  }

  const handleSendMessage = async () => {
    setLoadingSubmit(true)

    if (inputMessage.trim().length > 0) {
      const data = inputMessage

      let newMessage = {
        user: global.profile._id,
        user_eth_address: global.profile.eth_address,
        text: data,
      }

      setInputMessage('')
      saveMessage(newMessage)
    }

    if (previewFiles.length > 0) {

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

            {channel.order_id && channel.order_id.transactionHash && (
              <BreadcrumbItem>
                <Link href={global &&
                  global.profile &&
                  global.profile._id !== channel.buyer._id ? `/profile/orders/as-seller/${channel.order_id.transactionHash}` : `/profile/orders/detail/${channel.order_id.transactionHash}`} cursor={'pointer'} _hover={{
                    textDecoration: "underline"
                  }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                    textDecoration: "underline"
                  }}>Order</Text></Link>
              </BreadcrumbItem>
            )}

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
                  messages={channel.messages}
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
                {channel && channel.status === true || isLoading ? (
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
                ) : null}
              </Flex>
            </Flex>
          </Flex>
          <Text fontStyle={"italic"} color="red" mt="1em" >{t("Sensitive")}</Text>
        </Box>
        <Box w={{ base: 'full', lg: '30%' }} m="5px" p="1em" >
          {channel.item_id && channel.item_id.slug && (
            <Button mt="2em" w="100%" color={'white'} backgroundColor={'#00abd1'} onClick={() => router.push("/item/" + channel.item_id.slug)} _hover={{
              bg: "blue.400"
            }}>Item</Button>
          )}
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
            }}>{t("Order doesn't exist")}</Button>
          )}

          {channel && channel.status === true ? (
            <>
              {channel && global.profile._id === channel.seller._id && channel.order_id === null && (<Button
                bg="red.300"
                color="white"
                w="100%"
                mt="2em"
                fontSize={'16px'}
                fontWeight={'600'}
                onClick={() => updateStatusChannel(false)}
                _hover={{
                  bg: "red.400"
                }}
              >
                {t("Cancel Chat")}
              </Button>)}
            </>
          ) : (
            <>
              <Alert mt="1em" status='error'>
                <AlertIcon />
                {t("Channel blocked")}
              </Alert>
              {channel && global.profile._id === channel.seller._id && channel.order_id === null && (<Button mt="1em" w="100%" color={'white'} backgroundColor={'green.700'} onClick={() => updateStatusChannel(true)} _hover={{
                bg: "green.800"
              }}>Abrir chat</Button>)}
            </>
          )}
          <BuyConfigCard channel={channel} profile={global.profile} update={mutate} t={t} />
        </Box>
      </Container>
    </>
  )
}

export default MailBoxByOrderId;
