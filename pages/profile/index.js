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

const Profile = () => {
  const global = useGlobal()
  const router = useRouter()

  const [dataProfile, setDataProfile] = useState(null)
  const [balanceToken, setBalanceToken] = useState(null)

  useEffect(() => {
    const setProfile = async () => {
      if (global && global.profile) {
        setDataProfile(global.profile)
        await balanceUbi1(global.profile.eth_address).then((res) => {
          setBalanceToken(res)
        })
      } else {
        router.push('/')
      }
    }
    setProfile()
  }, [global, router])

  if (!dataProfile) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - My Profile</title>
      </Head>
      <ProfileMenu>
        <Box h={{ md: '100vh' }} w={{ base: 'full' }}>
          <Text fontWeight={'bold'}>My Info</Text>
          <Text fontWeight={'bold'}>Proof of humanity information</Text>
          <MyInfoPohCard dataProfile={dataProfile} balance={balanceToken} />
          <Text fontWeight={'bold'}>Personal Info</Text>
          <MyInfoPrivateCard dataProfile={dataProfile} />
          <Button onClick={() => router.push("/profile/mailboxs/628d1ef2c39d5841b9105889")}>Mailbox tanto</Button>
        </Box>
      </ProfileMenu>
    </>
  )
}

export default Profile
