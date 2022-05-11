import Link from 'next/link';
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Portal
} from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import UserInfo from '../Infos/userInfo';
import { useEffect, useState } from 'react'
import { useGlobal } from '../../providers/globalProvider'

const UserMenu = () => {

  const global = useGlobal()
  const [profileLogin, setProfileLogin] = useState(null)

  useEffect(() => {
    const getProfile = () => {
      console.log(global.profile)
      setProfileLogin(global.profile);
    }
    getProfile()
  }, [global])

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
            <Link href="/mailbox">Disconnect</Link>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default UserMenu;
