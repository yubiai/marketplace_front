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
import Head from 'next/head'
import Loading from '../../../components/Spinners/Loading'
import { useGlobal } from '../../../providers/globalProvider'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import useFetch from '../../../hooks/data/useFetch'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useUser from '../../../hooks/data/useUser'
import ItemCardPublish from '../../../components/Cards/ItemCardPublish'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation';

const Listings = () => {
  const global = useGlobal()
  const router = useRouter()
  const { t } = useTranslation("listing");
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  const { data, isLoading, isError, mutate } = useFetch(
    global && global.profile && global.profile._id
      ? `/profiles/my_published/${global.profile._id}?page=${global.pageIndex}&size=8`
      : null,
    global?.profile?.token
  )

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading && !data || !user) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Listings</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{
            base: data?.items?.length < 2 ? '80vh' : 'full',
            md: data?.items.length === 0 ? '80vh' : 'full',
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
              <Text>{t("Your Listings")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>

          {data && data.items && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">{t("You do not have any items listings.")}</Heading>
              </Center>
              <Center>
                <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
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
                return <ItemCardPublish key={i} item={item} token={global?.profile?.token} mutate={mutate}  t={t} />
              })}
          </Grid>
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Listings
