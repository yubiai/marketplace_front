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
} from 'react-icons/md'
import { useGlobal } from '../../providers/globalProvider'
import { balanceUbi1 } from '../../utils/ethereum'
import { useRouter } from 'next/router'
import ButtonConnect from '../Buttons/ButtonConnect'
import ButtonSwitchNetwork from '../Buttons/ButtonSwitchNetwork'

const DrawerMenu = () => {
  const global = useGlobal()
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const [listCategory, onListCategory] = useState(false)
  const [statusLogin, setStatusLogin] = useState(false)
  const [balanceToken, setBalanceToken] = useState(null)

  const onCategory = () => {
    onListCategory(!listCategory)
  }

  useEffect(() => {
    const verifyLogin = async () => {
      if (global && global.profile) {
        await balanceUbi1(global.profile.eth_address || null).then((res) => {
          setBalanceToken(res)
        })
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
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader bg="yb.1">
            {statusLogin ? (
              <UserInfo
                profile={global && global.profile}
                balanceToken={balanceToken}
              />
            ) : (
              <>
                <ButtonConnect />
                <ButtonSwitchNetwork />
              </>
            )}
          </DrawerHeader>
          <Divider />

          <DrawerBody>
            <List spacing={3}>
              <ListItem>
                <Link href="/">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={'left'}
                  >
                    <ListIcon as={MdHome} />
                    Home
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
                  Categories
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
                        Services
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
                        Profile
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
                        Notifications
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
                        New Listing
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/favourites">
                      <Button
                        onClick={() => onClose()}
                        className="step-favourites"
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdFavorite} />
                        Favourites
                      </Button>
                    </Link>
                  </ListItem>
                </>
              )}

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
                    Help
                  </Button>
                </Link>
              </ListItem>
            </List>
          </DrawerBody>

          <DrawerFooter>
            {statusLogin && (
              <Button onClick={() => router.push('/logout')}>Disconnect</Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerMenu
