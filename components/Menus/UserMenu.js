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
import UserInfo from '../Infos/userInfo'
import { useEffect, useState } from 'react'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'

const UserMenu = () => {
  const dispatch = useDispatchGlobal()

  const global = useGlobal()
  const [profileLogin, setProfileLogin] = useState(null)

  useEffect(() => {
    const getProfile = () => {
      setProfileLogin(global.profile)
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
      <Portal>
        <MenuList>
          <UserInfo profile={profileLogin} />
          <MenuItem>
            <Link href="/profile">My Info</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/orders">Orders</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/sale">Sale</Link>
          </MenuItem>
          <MenuItem>
            <Link href="/mailbox">Mailbox</Link>
          </MenuItem>
          <MenuItem>
            <span onClick={() => disconnect()}>Disconnect</span>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default UserMenu
