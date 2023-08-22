import React from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiMenu
} from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from "next/router";
import { FaUserCircle } from 'react-icons/fa'
import { BsFillBellFill } from 'react-icons/bs'
import { MdArticle, MdFavorite, MdForum, MdSell, MdShoppingBag, MdShoppingBasket, MdChat } from 'react-icons/md'
import useTranslation from 'next-translate/useTranslation';

export default function ProfileMenu({ children }) {
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Box minH={{ base: "full", md: "85vh" }} bg={'gray.100'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

const SidebarContent = ({ onClose, ...rest }) => {
  const router = useRouter();
  const { t } = useTranslation("profilemenu");
  
  const LinkItems = [
    { name: t("Profile"), icon: FaUserCircle, url: '/profile' },
    { name: t('Notifications'), icon: BsFillBellFill, url: '/profile/notifications' },
    { name: t('New Listing'), icon: MdSell, url: '/listing/new' },
    { name: t('Listings'), icon: MdArticle, url: '/profile/listings' },
    { name: 'Mailboxs', icon: MdChat, url: '/profile/mailboxs' },
    { name: t('Questions'), icon: MdForum, url: '/profile/questions' },
    { name: t('Orders'), icon: MdShoppingBag, url: '/profile/orders' },
    { name: t('Sales'), icon: MdShoppingBasket, url: '/profile/orders/sales' },
    { name: t('Bookmarks'), icon: MdFavorite, url: '/profile/bookmarks' },
  ]
  return (
    <Box
      bg={'white'}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'full', md: 60 }}
      pos="absolute"
      h="90vh"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" color="black" fontFamily="OpenSans, sans-serif" fontWeight="bold">
          {t("Menu")}
        </Text>
        <CloseButton color="black" display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url} onClose={onClose} samePathname={link && link.url === router.pathname ? true : false}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, url, children, onClose, samePathname, ...rest }) => {
  return (
    <Link
      href={url}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={() => {
        if (samePathname) {
          onClose()
        }
      }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        color="black"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  const { t } = useTranslation("profilemenu");
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={'white'}
      borderBottomWidth="1px"
      borderBottomColor={'gray.200'}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
      {t("Menu")}
      </Text>
    </Flex>
  )
}
