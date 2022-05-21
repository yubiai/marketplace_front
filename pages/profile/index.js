import { Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import MyInfoPohCard from '../../components/Cards/MyInfoPohCard'
import MyInfoPrivateCard from '../../components/Cards/MyInfoPrivateCard'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import { useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'

const Profile = () => {
  const global = useGlobal()

  const [dataProfile, setDataProfile] = useState(null)
  const [balanceToken, setBalanceToken] = useState(null)

  useEffect(() => {
    const setProfile = async () => {
      if (global && global.profile) {
        setDataProfile(global.profile)
        await balanceUbi1(global.profile.eth_address).then((res) => {
          setBalanceToken(res)
        })
      }
    }
    setProfile()
  }, [global])

  return (
    <>
      <ProfileMenu>
        <Box h={{ md: '100vh' }}>
          <Text fontWeight={'bold'}>My Info</Text>
          <Text fontWeight={'bold'}>Proof of humanity information</Text>
          <MyInfoPohCard dataProfile={dataProfile} balance={balanceToken} />
          <Text fontWeight={'bold'}>Personal Info</Text>
          <MyInfoPrivateCard dataProfile={dataProfile} />
        </Box>
      </ProfileMenu>
    </>
  )
}

export default Profile
