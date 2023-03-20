import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Center,
  Container,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OrderCardSeller from '../../../../components/Cards/OrderCardSeller'
import Paginations from '../../../../components/Layouts/Paginations'
import ProfileMenu from '../../../../components/Menus/ProfileMenu'
import Loading from '../../../../components/Spinners/Loading'
import useFetch from '../../../../hooks/data/useFetch'
import useUser from '../../../../hooks/data/useUser'
import Error from '../../../../components/Infos/Error'
import {
  useDispatchGlobal,
  useGlobal,
} from '../../../../providers/globalProvider'
import { setYubiaiInstance } from '../../../../providers/orderProvider'
import useTranslation from 'next-translate/useTranslation';

const Sales = () => {
  const global = useGlobal();
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const { t } = useTranslation("orders");
  const { user, loggedOut } = useUser();

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

  const { data, isLoading, isError} = useFetch(
    global && global.profile && global.profile.eth_address
      ? `/orders/seller/${global.profile.eth_address}?page=${global.pageIndex}&size=4`
      : null,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    async function initialArbInstance(){
      if (!global.yubiaiPaymentArbitrableInstance) {
        const res = await setYubiaiInstance(dispatch);
        if(!res){
          toast({
            title: "Wrong Network",
            description: "Change the network to one that is enabled.",
            position: 'top-right',
            status: 'warning',
            duration: 3000,
            isClosable: true
          });
          setTimeout(() => {
            router.push("/logout");
          }, 3000);
          return
        }
        return
      }
    }
    initialArbInstance();
  }, [global.yubiaiPaymentArbitrableInstance]);

  if (isLoading || !global.yubiaiPaymentArbitrableInstance) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Sales </title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{
            base: data && data.items && data.items.length > 1 ? 'full' : '70vh',
            sm: data && data.items && data.items.length > 1 ? 'full' : '85vh',
            md: 'full',
          }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Breadcrumb spacing='8px' mt='1em' mb='1em' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href="/" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>{t("Home")}</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
                <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>{t("Profile")}</Text>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>{t("Sales")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          {data && data.items && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">{t("You do not have any sales")}</Heading>
              </Center>
              <Center>
                <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
                  {t("Go Back")}
                </Button>
              </Center>
            </>
          )}
          {data &&
            data.items &&
            data.items.length > 0 &&
            data.items.map((item, i) => {
              return <OrderCardSeller yubiaiPaymentInstance={global.yubiaiPaymentArbitrableInstance} order={item} key={i} />
            })}
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Sales
