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
import { MdArticle, MdChat, MdFavorite, MdForum, MdHelp, MdOutlinePowerSettingsNew, MdSell, MdShoppingBag, MdShoppingBasket } from 'react-icons/md'
import useTranslation from 'next-translate/useTranslation';

const UserMenu = () => {
  const router = useRouter()

  const global = useGlobal()
  const { t } = useTranslation("drawermenu");
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
      <Portal zIndex={'20'}>
        <MenuList color="black" bg="white">
          <UserInfo profile={profileLogin} balanceToken={balanceToken} t={t}/>

          <Link href="/profile">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}>
              <FaUserCircle /> <Text fontWeight={"medium"} ml="5px">{t("Profile")}</Text></MenuItem>
          </Link>
          <Link href="/profile/notifications">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><BsFillBellFill /> <Text fontWeight={"medium"} ml="5px">{t("Notifications")}</Text></MenuItem>
          </Link>
          <Link href="/listing/new">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdSell /> <Text fontWeight={"medium"} ml="5px">{t("New Listing")}</Text></MenuItem>
          </Link>
          <Link href="/profile/listings">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdArticle /> <Text fontWeight={"medium"} ml="5px">{t("Listings")}</Text></MenuItem>
          </Link>
          <Link href="/profile/mailboxs">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdChat /> <Text fontWeight={"medium"} ml="5px">Mailboxs</Text></MenuItem>
          </Link>
          <Link href="/profile/questions">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdForum /> <Text fontWeight={"medium"} ml="5px">{t("Questions")}</Text></MenuItem>
          </Link>
          <Link href="/profile/orders">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdShoppingBag /> <Text fontWeight={"medium"} ml="5px">{t("Orders")}</Text></MenuItem>
          </Link>
          <Link href="/profile/orders/sales">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdShoppingBasket /> <Text fontWeight={"medium"} ml="5px">{t("Sales")}</Text></MenuItem>
          </Link>
          <Link href="/profile/favourites">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdFavorite /> <Text fontWeight={"medium"} ml="5px">{t("Favourites")}</Text></MenuItem>
          </Link>
          <Link href="/help">
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdHelp /> <Text fontWeight={"medium"} ml="5px">{t("Help")}</Text></MenuItem>
          </Link>
          <span onClick={() => router.push('/logout')}>
            <MenuItem color="black" _focus={{ bg: "gray.200" }}><MdOutlinePowerSettingsNew /> <Text fontWeight={"medium"} ml="5px">{t("Disconnect")}</Text></MenuItem>
          </span>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default UserMenu
