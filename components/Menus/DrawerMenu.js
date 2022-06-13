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
  useToast,
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
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdHome,
  MdDesignServices,
} from 'react-icons/md'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { profileService } from '../../services/profileService'
import { balanceUbi1, loginMetamask } from '../../utils/ethereum'

const DrawerMenu = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const toast = useToast()

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
        await balanceUbi1(global.profile.eth_address).then((res) => {
          setBalanceToken(res)
        })
        setStatusLogin(true)
      } else {
        setStatusLogin(false)
      }
    }
    verifyLogin()
  }, [global])

  const onConnect = async () => {
    const signerAddress = await loginMetamask()

    if (!signerAddress) {
      console.log('Error al iniciar sesion.')
      toast({
        title: 'Failed to login.',
        description: 'Review application',
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    console.log('Address: ', signerAddress)
    const result = await profileService.login(signerAddress)
    console.log(result.data.data)
    dispatch({
      type: 'AUTHPROFILE',
      payload: result.data.data,
    })
    toast({
      title: 'Login',
      description: 'You have successfully logged in, Welcome!',
      position: 'top-right',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const disconnect = () => {
    console.log('Disconnect')
    dispatch({
      type: 'AUTHPROFILE',
      payload: null,
    })
    localStorage.removeItem('Yubiai');
  }

  return (
    <>
      <Button ref={btnRef} color="white" bg="transparent" onClick={onOpen}>
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
              <Button
                backgroundColor={'white'}
                color={'#00abd1'}
                rounded={'full'}
                ml="1em"
                cursor={'pointer'}
                onClick={() => onConnect()}
              >
                Connect
              </Button>
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
              {global && global.profile && (
                <>
                  <ListItem>
                    <Link href="/profile">
                      <Button
                        onClick={() => onClose()}
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
                    <Link href="/notifications">
                      <Button
                        onClick={() => onClose()}
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
                    <Link href="/publish/new">
                      <Button
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdSell} />
                        New Publish
                      </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/profile/favorites">
                      <Button
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={'left'}
                      >
                        <ListIcon as={MdFavorite} />
                        Favorites
                      </Button>
                    </Link>
                  </ListItem>
                </>
              )}

              <ListItem>
                <Link href="/help">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={'left'}
                  >
                    <ListIcon as={MdHelp} />
                    Help
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => onCategory()}
                  w="full"
                  bg="transparent"
                  justifyContent={'left'}
                >
                  <ListIcon
                    as={listCategory ? MdKeyboardArrowUp : MdKeyboardArrowDown}
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
            </List>
          </DrawerBody>

          <DrawerFooter>
            {statusLogin && (
              <Button onClick={() => disconnect()}>Disconnect</Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerMenu
