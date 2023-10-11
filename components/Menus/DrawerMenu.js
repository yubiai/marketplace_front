import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  Box,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import UserInfo from '../Infos/UserInfo'
import { FaUserCircle } from 'react-icons/fa'
import { BsFillBellFill } from 'react-icons/bs'
import {
  MdSell,
  MdFavorite,
  MdHelp,
  MdArrowUpward,
  MdArrowDownward,
  MdHome,
  MdDesignServices,
  MdShoppingBasket,
  MdShoppingBag,
  MdForum,
  MdOutlinePowerSettingsNew,
  MdArticle,
  MdOutlineShuffle
} from 'react-icons/md'
import { useGlobal } from '../../providers/globalProvider'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation';

const DrawerMenu = () => {
  const global = useGlobal()
  const router = useRouter()
  const { t } = useTranslation("drawermenu");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const [listCategory, onListCategory] = useState(false)
  const [statusLogin, setStatusLogin] = useState(false)

  const onCategory = () => {
    onListCategory(!listCategory)
  }

  useEffect(() => {
    const verifyLogin = async () => {
      if (global && global.profile) {
        setStatusLogin(true)
      } else {
        setStatusLogin(false)
      }
    }
    verifyLogin()
  }, [global.profile])

  return (
    <>
      <Button
        ref={btnRef}
        color="white"
        bg="transparent"
        onClick={onOpen}
        p={0}
        display={{ base: 'flex', md: 'none' }}
      >
        <FiMoreVertical fontSize={'2em'} />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent overflow='scroll'>
          <DrawerCloseButton />

          <DrawerHeader bg="yb.1">

            {statusLogin ? (
              <UserInfo
                profile={global && global.profile}
                t={t}
              />
            ) : (
              <>
                <p>Boton falta</p>
              </>
            )}

          </DrawerHeader>
          <Divider />

          <DrawerBody>
            <List spacing={3}>
              <ListItem>
                <Box>
                <p>Boton falta</p>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <Link href="/">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={'left'}
                  >
                    <ListIcon as={MdHome} />
                    {t("Home")}
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://bridge.connext.network/?receivingChainId=100"
                  passHref legacyBehavior
                >
                  <a target="_blank" rel="noopener noreferrer">
                    <Button
                      className='step-bridge'
                      onClick={() => onCategory()}
                      w="full"
                      bg="transparent"
                      justifyContent={'left'}
                    >
                      <ListIcon as={MdOutlineShuffle} />
                      Bridge
                    </Button>
                  </a>
                </Link>
              </ListItem>
              
              <ListItem>
                <Link href="/help">
                  <Button
                    onClick={() => onClose()}
                    className="step-help"
                    w="full"
                    bg="transparent"
                    justifyContent={'left'}
                  >
                    <ListIcon as={MdHelp} />
                    {t("Help")}
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Button
                  className='step-category'
                  onClick={() => onCategory()}
                  w="full"
                  bg="transparent"
                  justifyContent={'left'}
                >
                  <ListIcon
                    as={listCategory ? MdArrowUpward : MdArrowDownward}
                  />
                   {t("Categories")}
                </Button>
              </ListItem>
              {listCategory && (
                <>
                  <ListItem>
                    <Link href="/category/services">
                      <Button
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdDesignServices} />
                        {t("Services")}
                      </Button>
                    </Link>
                  </ListItem>
                </>
              )}
              {global && global.profile && (
                <>
                  <ListItem>
                    <Link href="/profile">
                      <Button
                        onClick={() => onClose()}
                        className="step-usermenu"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={FaUserCircle} />
                        {t("Profile")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/bookmarks">
                      <Button
                        onClick={() => onClose()}
                        className="step-bookmarks"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdFavorite} />
                        {t("Bookmarks")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/notifications">
                      <Button
                        onClick={() => onClose()}
                        className='step-notifications'
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={BsFillBellFill} />
                        {t("Notifications")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/listing/new">
                      <Button
                        className='step-sell'
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdSell} />
                        {t("New Listing")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/listings">
                      <Button
                        className='step-sell'
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdArticle} />
                        {t("Listings")}
                      </Button>
                    </Link>
                  </ListItem>
                 
                  <ListItem>
                    <Link href="/profile/questions">
                      <Button
                        onClick={() => onClose()}
                        className="step-bookmarks"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdForum} />
                        {t("Questions")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/orders">
                      <Button
                        onClick={() => onClose()}
                        className="step-bookmarks"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdShoppingBag} />
                        {t("Orders")}
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/orders/sales">
                      <Button
                        onClick={() => onClose()}
                        className="step-bookmarks"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdShoppingBasket} />
                        {t("Sales")}
                      </Button>
                    </Link>
                  </ListItem>
                
                </>
              )}

            </List>
          </DrawerBody>

          <DrawerFooter>
            {statusLogin && (
              <Button onClick={() => router.push('/logout')}><MdOutlinePowerSettingsNew /> <Text fontWeight={"bold"} ml="5px">{t("Disconnect")}</Text></Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerMenu
