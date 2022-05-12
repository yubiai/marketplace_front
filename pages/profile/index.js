import {
  Text
} from '@chakra-ui/react'
import MyInfoPohCard from '../../components/Cards/MyInfoPohCard'
import MyInfoPrivateCard from '../../components/Cards/MyInfoPrivateCard';
import ProfileMenu from '../../components/Menus/ProfileMenu'

const Profile = () => {
  return (
    <>
      <ProfileMenu>
        <Text fontWeight={"bold"}>My Info</Text>
        <Text fontWeight={"bold"}>Proof of humanity information</Text>
        <MyInfoPohCard />
        <Text fontWeight={"bold"}>Personal Info</Text>
        <MyInfoPrivateCard />
      </ProfileMenu>
    </>
  )
}

export default Profile
