import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MyInfoPohCard from '../../components/Cards/MyInfoPohCard';
import MyInfoPrivateCard from '../../components/Cards/MyInfoPrivateCard';
import ProfileMenu from '../../components/Menus/ProfileMenu';
import { useGlobal } from '../../providers/globalProvider';
import { etherscanService } from '../../services/etherscanService';

const Profile = () => {
  const global = useGlobal()

  const [dataProfile, setDataProfile] = useState(null)
  const [balanceToken, setBalanceToken] = useState(null)

  const getBalanceUbi = async (address) => {
    await etherscanService.getBalanceUbi(address)
    .then((res) => {
      let oldBalance = res.data.result;
      let newBalance = Number.parseFloat(`${oldBalance}e-18`).toFixed(2); 
      setBalanceToken(newBalance)
    })
    .catch((err) => {
      console.log(err);
      setBalanceToken("No Data")
    });
      
  };


  useEffect(() => {
    const setProfile = async () => {
      if (global && global.profile) {
        setDataProfile(global.profile)
        getBalanceUbi(global.profile.eth_address)
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
