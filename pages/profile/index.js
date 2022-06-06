import { Box, Button, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MyInfoPohCard from '../../components/Cards/MyInfoPohCard'
import MyInfoPrivateCard from '../../components/Cards/MyInfoPrivateCard'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import Loading from '../../components/Spinners/Loading'
import { useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'
import useFetch from '../../hooks/data/useFetch'

const Profile = () => {
  const global = useGlobal()
  const router = useRouter()

  const [balanceToken, setBalanceToken] = useState(null)

  const {
    data: profile,
    loading,
    error,
  } = useFetch(
    `/profiles/${
      global && global.profile && global.profile.eth_address
        ? global.profile.eth_address
        : null
    }`
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

  if (loading) return <Loading />
  if (error) throw error

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - My Profile</title>
      </Head>
      <ProfileMenu>
        <Box
          maxW="6xl"
          h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
          display={'flex'}
          flexDirection={'column'}
          w={{ base: 'full' }}
        >
          <Text fontWeight={'bold'}>My Info</Text>
          <Text fontWeight={'bold'}>Proof of humanity information</Text>
          <MyInfoPohCard dataProfile={profile} balance={balanceToken} />
          <Text fontWeight={'bold'}>Personal Info</Text>
          <MyInfoPrivateCard dataProfile={profile} />
          <Button
            onClick={() =>
              router.push('/profile/mailboxs/628d1ef2c39d5841b9105889')
            }
          >
            Mailbox tanto
          </Button>
        </Box>
      </ProfileMenu>
    </>
  )
}

export default Profile
