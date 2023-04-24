import { Box, Breadcrumb, BreadcrumbItem, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import MyInfoPohCard from '../../components/Cards/MyInfoPohCard'
import MyInfoPrivateCard from '../../components/Cards/MyInfoPrivateCard'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import Loading from '../../components/Spinners/Loading'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'
import useFetch from '../../hooks/data/useFetch'
import Error from '../../components/Infos/Error'
import useUser from '../../hooks/data/useUser'
import { useRouter } from 'next/router'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation';
import MyInfoLensCard from '../../components/Cards/MyInfoLensCard'

const Profile = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const { t } = useTranslation("profilepage");
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
  }, [user, loggedOut, router])

  const [balanceToken, setBalanceToken] = useState(null)

  const {
    data: profile,
    isLoading,
    isError,
  } = useFetch(
    global && global.profile && global.profile._id
      ? `/profiles/id/${global.profile._id}`
      : null,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    const getInitBalance = async () => {
      if (profile) {
        await balanceUbi1(profile.eth_address || null).then((res) => {
          setBalanceToken(res)
        })
      }
    }
    getInitBalance()
  }, [profile])

  if (isLoading || !user || !profile) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - My Profile</title>
      </Head>
      <ProfileMenu>
        <Box
          maxW="6xl"
          h={{ base: 'full', sm: 'full', md: 'full' }}
          display={'flex'}
          flexDirection={'column'}
          w={{ base: 'full' }}
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
              <Text>{t("My Info")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          {profile && profile.permission === 6 && (
            <>
              <Text color="red.800" fontWeight={'bold'}>User Test</Text>
            </>
          )}
          <Text fontWeight={'bold'}>{t("Personal Info")}</Text>
          <MyInfoPrivateCard dataProfile={profile} t={t} />
          <Text fontWeight={'bold'}>{t("Proof of humanity Information")}</Text>
          <MyInfoPohCard dataProfile={profile} balance={balanceToken} t={t} />
          <Text fontWeight={'bold'}>{t("Lens Protocol Information")}</Text>
          <MyInfoLensCard dataProfile={profile} t={t} />
        </Box>
      </ProfileMenu>
    </>
  )
}

export default Profile
