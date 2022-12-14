import Link from 'next/link'
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Portal,
  Text,
} from '@chakra-ui/react'
import { FaUserCircle } from 'react-icons/fa'
import UserInfo from '../Infos/UserInfo'
import { useEffect, useState } from 'react'
import { useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'
import { useRouter } from 'next/router'
import { BsFillBellFill } from 'react-icons/bs'
import { MdFavorite, MdForum, MdHelp, MdOutlinePowerSettingsNew, MdSell, MdShoppingBag, MdShoppingBasket } from 'react-icons/md'

const UserMenu = () => {
  const router = useRouter()

  const global = useGlobal()
  const [profileLogin, setProfileLogin] = useState(null)
  const [balanceToken, setBalanceToken] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      if (global.profile) {
        setProfileLogin(global.profile)
        await balanceUbi1(global.profile.eth_address || null).then((res) => {
          setBalanceToken(res)
        })
      }
    }
    getProfile()
  }, [global.profile])

  return (
    <Menu mr="1em">
      {global && global.profile && profileLogin && (
        <MenuButton
          className='step-usermenu'
          as={IconButton}
          mr="10px"
          aria-label="Options"
          borderColor={'transparent'}
          icon={<FaUserCircle color="white" />}
          variant="outline"
          _hover={{ bg: '#1C538A', color: 'gray.200' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
        />
      )}
      <Portal>
        <MenuList color="black" bg="white">
          <UserInfo profile={profileLogin} balanceToken={balanceToken} />

          <Link href="/profile">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}>
            <FaUserCircle /> <Text fontWeight={"bold"} ml="5px">Profile</Text></MenuItem>
          </Link>
          <Link href="/profile/notifications">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><BsFillBellFill /> <Text fontWeight={"bold"} ml="5px">Notifications</Text></MenuItem>
          </Link>
          <Link href="/profile/listings">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdSell /> <Text fontWeight={"bold"} ml="5px">New Listing</Text></MenuItem>
          </Link>
          <Link href="/profile/questions">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdForum /> <Text fontWeight={"bold"} ml="5px">Questions</Text></MenuItem>
          </Link>
          <Link href="/profile/orders">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdShoppingBag /> <Text fontWeight={"bold"} ml="5px">Orders</Text></MenuItem>
          </Link>
          <Link href="/profile/orders/sales">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdShoppingBasket /> <Text fontWeight={"bold"} ml="5px">Sales</Text></MenuItem>
          </Link>
          <Link href="/profile/favourites">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdFavorite /> <Text fontWeight={"bold"} ml="5px">Favourites</Text></MenuItem>
          </Link>
          <Link href="/help">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdHelp /> <Text fontWeight={"bold"} ml="5px">Help</Text></MenuItem>
          </Link>
          <span onClick={() => router.push('/logout')}>
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdOutlinePowerSettingsNew /> <Text fontWeight={"bold"} ml="5px">Disconnect</Text></MenuItem>
          </span>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default UserMenu
