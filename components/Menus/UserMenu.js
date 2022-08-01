import Link from 'next/link'
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Portal,
} from '@chakra-ui/react'
import { FaUserCircle } from 'react-icons/fa'
import UserInfo from '../Infos/UserInfo'
import { useEffect, useState } from 'react'
import { useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'
import { useRouter } from 'next/router'

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
        <MenuList>
          <UserInfo profile={profileLogin} balanceToken={balanceToken} />

          <Link href="/profile">
            <MenuItem>My Info</MenuItem>
          </Link>
          <Link href="/profile/notifications">
            <MenuItem>Notifications</MenuItem>
          </Link>
          <Link href="/profile/published">
            <MenuItem>Published</MenuItem>
          </Link>
          <Link href="/profile/orders">
            <MenuItem>Orders</MenuItem>
          </Link>
          <Link href="/profile/orders/sales">
            <MenuItem>Sales</MenuItem>
          </Link>
          <span onClick={() => router.push('/logout')}>
            <MenuItem>Disconnect </MenuItem>
          </span>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default UserMenu
