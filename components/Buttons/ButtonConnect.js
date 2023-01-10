import Cookies from 'js-cookie'
import { useTour } from "@reactour/tour";
import { ethers } from 'ethers';

import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, useDisclosure, useToast,
  //useMediaQuery
} from '@chakra-ui/react'

import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { useEffect } from 'react';
import { connectWallet, signInWithEthereum, verifyNetwork } from '../../utils/connectWeb3';

let loading = false;

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
    onToggle()
    return
  }, [global.profile]);

  const onConnect = async () => {
    console.log("Inicio on connect");
    loading = true;

    const provider = new ethers.providers.Web3Provider(window && window.location ? window.ethereum : "null");
    const signer = provider.getSigner();

    // 1 - Connect app
    await connectWallet(provider)

    // 2 - Verify NetWork
    const confirmNetwork = await verifyNetwork();

    if (!confirmNetwork) {
      console.error("Error the network");
      toast({
        title: 'Failed to login.',
        description: 'Failed network, please change your network on metamask',
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      loading = false;
      return
    }

    // 3 - Create Sign
    const resultSignIn = await signInWithEthereum(signer);

    if (!resultSignIn && !resultSignIn.signature) {
      toast({
        title: 'Failed to login.',
        description: 'User denied message signature.',
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      loading = false;
      return
    }

    const { message, address, signature } = resultSignIn

    // 4 - Verify Signature
    await profileService.verifySignature(message, signature)
      .catch((err) => {
        console.error(err, "error")
        toast({
          title: 'Failed to login.',
          description: 'User denied message signature.',
          position: 'top-right',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        loading = false;
        return
      })

    // 5 - Login
    const res = await profileService.login(address)
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error) {
          console.error(err)
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
          loading = false;
          return
        }
      })

    if (!res) {
      loading = false;
      return
    }

    dispatch({
      type: 'AUTHERROR',
      payload: null
    });

    const token = res.data.token;
    let profile = res.data.data;

    profile = {
      ...res.data.data,
      signature,
      messageSignature: message
    }

    authGlobalAndCookies(profile, token);
    // JoyTour Initial
    if (profile?.permission === 1) {
      setTimeout(() => {
        setIsOpen(true)
        return
      }, 500);

      return
    }
    
    loading = false;
    return
  }

  //const [isLargerThanmd] = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {global && global.profile && (
        <Button
          className={'step-connect'}
          backgroundColor={'white'}
          color={'#00abd1'}
          rounded={'full'}
          w="90%"
          cursor={'pointer'}
          isDisabled={loading || global.profile && global.profile.eth_address}
        >
          {global.profile.eth_address.slice(0, 5) + "..." + global.profile.eth_address.slice(global.profile.eth_address.length - 4)}
        </Button>
      )}
      {!global.profile && (
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
              isDisabled={loading || global.profile && global.profile.eth_address}
            >
              Connect
            </Button>

          </PopoverTrigger>
          <PopoverContent width={{ base: '250px', md: 'full' }} pr={{ base: '0px', md: '1.5em' }}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Connect with your wallet and start earning crypto or hiring with your cryptos
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default ButtonConnect;
