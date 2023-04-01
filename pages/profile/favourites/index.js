import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Center,
  Container,
  Grid,
  Heading,
  Text,
} from '@chakra-ui/react'
import Loading from '../../../components/Spinners/Loading'
import Error from '../../../components/Infos/Error'
import Head from 'next/head'
import { useGlobal } from '../../../providers/globalProvider'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import useFetch from '../../../hooks/data/useFetch'
import Paginations from '../../../components/Layouts/Paginations'
import { useRouter } from 'next/router'
import useUser from '../../../hooks/data/useUser'
import { useEffect } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import ItemCardLg from '../../../components/Cards/ItemCardLg'
import useTranslation from 'next-translate/useTranslation';

const Favourites = () => {
  const global = useGlobal()
  const router = useRouter()
  const { t } = useTranslation("home")
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  const { data, isLoading, isError } = useFetch(
    global && global.profile && global.profile._id ? `/profiles/favourites/${global.profile._id}?page=${global.pageIndex}&size=8` : null,
    global && global.profile && global.profile.token
  )

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading && !data || !user) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Favourites</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{ base: data?.items?.length < 2 ? '80vh' : 'full', md: data?.items.length === 0 ? '80vh' : 'full' }}
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
              <Text>{t("Your favourites")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>

          {data && data.items && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">
                  {t("You do not have any items added to favourites")}
                </Heading>
              </Center>
              <Center>
                <Button bg="#00abd1" color="white" _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
                  {t("Go Back")}
                </Button>
              </Center>
            </>
          )}
          <Grid
            templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
            templateColumns={{ base: 'none', md: 'repeat(4, 1fr)' }}
            gap={1}
          >
            {data &&
              data.items &&
              data.items.length > 0 &&
              data.items.map((item, i) => {
                return <ItemCardLg key={i} item={item} />
              })}
          </Grid>
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Favourites
