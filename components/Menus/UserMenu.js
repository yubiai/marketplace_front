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
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'

const UserMenu = () => {
  const dispatch = useDispatchGlobal()

  const global = useGlobal()
  const [profileLogin, setProfileLogin] = useState(null)
  const [balanceToken, setBalanceToken] = useState(null)

  useEffect(() => {
    const getProfile = async() => {
      if (global && global.profile) {
        setProfileLogin(global.profile)
        await balanceUbi1(global.profile.eth_address)
          .then((res) => {
            setBalanceToken(res)
          })
      }
    }
    getProfile()
  }, [global])

  const disconnect = () => {
    console.log('Disconnect')
    dispatch({
      type: 'AUTHPROFILE',
      payload: null,
    })
  }

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
          <MenuItem>
            <Link href="/profile">My Info</Link>
          </MenuItem>
          <Link href="/publish/new">
            <MenuItem>New Publish</MenuItem>
          </Link>
          <Link href="/profile/orders">
            <MenuItem isDisabled>Orders</MenuItem>
          </Link>
          <Link href="/profile/sale">
            <MenuItem isDisabled>Sale</MenuItem>
          </Link>
          <Link href="/profile/mailboxs">
            <MenuItem isDisabled>Mailboxs</MenuItem>
          </Link>
          <MenuItem>
            <span onClick={() => disconnect()}>Disconnect</span>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default UserMenu
