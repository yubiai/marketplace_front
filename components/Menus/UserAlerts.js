import Link from 'next/link';

import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Button,
  Center,
  Portal
} from '@chakra-ui/react';
import { BsFillBellFill, BsClock } from 'react-icons/bs';
import { MdMessage, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { BiHappyAlt } from 'react-icons/bi';

const UserAlerts = () => {
  return (
    <Menu>
      {({ onClose }) => (
        <>
          <MenuButton
            as={IconButton}
            aria-label="alert"
            borderColor={'transparent'}
            icon={<BsFillBellFill color="white" />}
            variant="outline"
            _hover={{ bg: '#1C538A', color: 'gray.200' }}
            _expanded={{ bg: 'blue.400' }}
            _focus={{ boxShadow: 'outline' }}
          />
          <Portal>
            <MenuList>
              <Button
                bg="transparent"
                h="2em"
                float="right"
                onClick={() => onClose()}
              >
                <MdOutlineKeyboardArrowUp />
              </Button>
              <MenuItem
                icon={<BiHappyAlt />}
                borderBottom={'1px solid #bababa'}
              >
                The Englego´s course is in offer
              </MenuItem>
              <MenuItem icon={<BsClock />} borderBottom={'1px solid #bababa'}>
                You´ve 2 days, 45 minutes to confirm the payment
              </MenuItem>
              <MenuItem icon={<MdMessage />} borderBottom={'1px solid #bababa'}>
                You´ve 1 new message
              </MenuItem>
              <Center>
                <Button bg="transparent" color="#00abd1">
                  <Link href="/notifications">See more...</Link>
                </Button>
              </Center>
            </MenuList>
          </Portal>
        </>
      )}
    </Menu>
  );
};

export default UserAlerts;
