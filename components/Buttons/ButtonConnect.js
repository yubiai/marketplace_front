import Cookies from 'js-cookie'
import { useTour } from "@reactour/tour";

import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, useDisclosure, useToast,
  //useMediaQuery
} from '@chakra-ui/react'

import { loginMetamask, verifyNetwork } from '../../utils/ethereum'
import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { useEffect } from 'react';

const ButtonConnect = () => {
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const global = useGlobal();
  const { isOpen, onToggle, onClose } = useDisclosure()

  const { setIsOpen } = useTour();
  const authGlobalAndCookies = (profile, token) => {

    dispatch({
      type: 'AUTHPROFILE',
      payload: profile
    });

    const yubiaiLS = {
      token: token,
      wallet: profile.eth_address
    };

    Cookies.set('Yubiai', token, { expires: 1, secure: true })
    localStorage.setItem('Yubiai', JSON.stringify(yubiaiLS))
    toast({
      title: 'Welcome, you are successfully logged in.',
      description: 'Now you are able to start buying & selling on Yubiai.',
      position: 'top-right',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
    return
  }

  useEffect(() => {
    if(!global.profile){
      onToggle()
    }
    return
  }, []);

  const onConnect = async () => {

    const confirmNetwork = await verifyNetwork();

    if (!confirmNetwork) {
      console.log("Error the network");
      toast({
        title: 'Failed to login.',
        description: 'Failed network, please change your network on metamask',
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    const signerAddress = await loginMetamask()

    // Check with metamask
    if (!signerAddress) {
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

    // Login
    const res = await profileService.login(signerAddress)
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error) {
          console.log(err)
          toast({
            title: 'Failed to login.',
            description: err.response.data && err.response.data.error ? err.response.data.error : "Failed",
            position: 'top-right',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
          dispatch({
            type: 'AUTHERROR',
            payload: 'To connect it is necessary to be registered in Proof of Humanity and have your status as registered.'
          });
          return
        }
      })

    if (!res) {
      return
    }

    dispatch({
      type: 'AUTHERROR',
      payload: null
    });

    const token = res.data.token;
    const profile = res.data.data;

    authGlobalAndCookies(profile, token);
    // JoyTour Initial
    if (profile?.permission === 1) {
      setTimeout(() => {
        setIsOpen(true)
        return
      }, 500);

      return
    }

    return
  }

  //const [isLargerThanmd] = useMediaQuery('(min-width: 768px)')

  return (
    <>

      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button
            className={'step-connect'}
            backgroundColor={'white'}
            color={'#00abd1'}
            rounded={'full'}
            w="90%"
            cursor={'pointer'}
            onClick={() => onConnect()}
            isDisabled={global.profile && global.profile.eth_address}
          >
            {global.profile && global.profile.eth_address ? global.profile.eth_address.slice(0, 5) + "..." + global.profile.eth_address.slice(global.profile.eth_address.length - 4) : 'Connect'}
          </Button>
        </PopoverTrigger>
        <PopoverContent>

          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
          Connect with your wallet and start earning crypto or hiring with your cryptos
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default ButtonConnect;
