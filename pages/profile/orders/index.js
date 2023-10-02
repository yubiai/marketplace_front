import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Center,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OrderCardBuyer from '../../../components/Cards/OrderCardBuyer'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import useUser from '../../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'
import useTranslation from 'next-translate/useTranslation';
import { useNetwork } from 'wagmi'
import { getContractsForNetwork } from '../../../utils/walletUtils'
import { yubiaiArbitrable } from '../../../utils/escrow-utils/abis'

const Orders = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const { t } = useTranslation("orders")
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
    if (!yubiaiContract.yubiaiArbitrable) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch]);

  //Network Wagmi
  const { chain } = useNetwork()
  const networkType = chain && chain.name && chain.name.toLowerCase();
  const yubiaiContract = getContractsForNetwork(networkType);

  const { data, isLoading, isError } = useFetch(
    global && global.profile && global.profile.eth_address ? `/orders/buyer/${global.profile.eth_address}?page=${global.pageIndex}&size=5&network=${networkType}` : null,
    global && global.profile && global.profile.token
  )

  if (isLoading) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Orders </title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{ base: data && data.items && data.items.length > 1 ? 'full' : '70vh', sm: data && data.items && data.items.length > 1 ? 'full' : '85vh', md: 'full' }}
          display={'flex'}
          flexDirection={'column'}
          mb="2em"
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
              <Text>{t("Orders")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>

          {data && data.items && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">{t("You do not have any orders")}</Heading>
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
              return <OrderCardBuyer yubiaiContract={yubiaiContract.yubiaiArbitrable} abiYubiai={yubiaiArbitrable} order={item} network={networkType} key={i} t={t} />
            })}
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Orders;
