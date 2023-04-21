import Cookies from 'js-cookie'
import { useTour } from "@reactour/tour";
import { ethers } from 'ethers';
import {
  SignInWithLens
} from '@lens-protocol/widgets-react'

import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, useDisclosure, useToast,
  //useMediaQuery
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Center,
  Image,
  Spinner,
} from '@chakra-ui/react'

import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { useEffect, useState } from 'react';
import { connectWallet, signInWithEthereum, verifyNetwork } from '../../utils/connectWeb3';

import useTranslation from 'next-translate/useTranslation';

const ButtonConnect = () => {
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const global = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("navbar");
  const { isOpen: isPopoverOpen, onToggle: onPopoverToggle, onClose: onPopoverClose } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

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
      title: t('Welcome, you are successfully logged in'),
      description: t('Now you are able to start buying & selling on Yubiai'),
      position: 'top-right',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
    return
  }

  useEffect(() => {
    // Toggle Popover
    onPopoverToggle()
    return
  }, [global.profile]);

  const onConnectPoh = async () => {
    setIsLoading(true);

    const provider = new ethers.providers.Web3Provider(window && window.location ? window.ethereum : "null");
    const signer = provider.getSigner();

    // 1 - Connect app
    await connectWallet(provider)

    // 2 - Verify NetWork
    const confirmNetwork = await verifyNetwork();

    if (!confirmNetwork) {
      console.error("Error the network");
      toast({
        title: t('Failed to login'),
        description: t('Wrong network, please change your network on metamask.'),
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    if (confirmNetwork === "switch") {
      // Retry Connect
      return
    }

    // 3 - Create Sign
    const resultSignIn = await signInWithEthereum(signer);

    if (!resultSignIn && !resultSignIn.signature) {
      toast({
        title: t('Failed to login'),
        description: t('User denied message signature.'),
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    const { message, address, signature } = resultSignIn

    // 4 - Verify Signature
    await profileService.verifySignature(message, signature)
      .catch((err) => {
        console.error(err, "error")
        toast({
          title: t('Failed to login'),
          description: t('User denied message signature.'),
          position: 'top-right',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        setIsLoading(false)
        return
      })

    // 5 - Login
    const res = await profileService.login(address)
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error) {
          console.error(err)
          toast({
            title: t('Failed to login'),
            description: err.response.data && err.response.data.error ? err.response.data.error : t("Failed"),
            position: 'top-right',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
          dispatch({
            type: 'AUTHERROR',
            payload: t('To connect it is necessary to be registered in Proof of Humanity and have your status as registered.')
          });
          onModalClose()
          setIsLoading(false)
          return
        }
      })

    if (!res) {
      setIsLoading(false)
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

    onModalClose()
    setIsLoading(false)
    return
  }

  const onConnectLens = async () => {
    // 1 - Verify NetWork
    setIsLoading(true)
    const confirmNetwork = await verifyNetwork();

    if (!confirmNetwork) {
      console.error("Error the network");
      toast({
        title: t('Failed to login'),
        description: t('Wrong network, please change your network on metamask.'),
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    if (confirmNetwork === "switch") {
      // Retry Connect
      return
    }
  }

  async function onSignIn(tokens, profile) {
    console.log('tokens: ', tokens)
    console.log('profile: ', profile)
    setIsLoading(true)

    if (tokens && profile) {
      try {

        // step 1 - Login
        const res = await profileService.loginLens({
          profile: profile,
          tokenLens: tokens.accessToken
        });

        console.log(res, "res")


        dispatch({
          type: 'AUTHERROR',
          payload: null
        });

        const token = res.data.token;
        const profileData = res.data.data;

        // step 3 - auth cookies
        authGlobalAndCookies(profileData, token);
        // JoyTour Initial
        if (profileData && profileData.permission && profileData.permission === 1) {
          setTimeout(() => {
            setIsOpen(true)
            return
          }, 500);

          return
        }

        onModalClose()
        setIsLoading(false);
        return
      } catch (error) {
        console.error(error, "error");
        setIsLoading(false);
        return
      }
    }

  }

  const errorLens = () => {
    toast({
      title: t('Failed to login'),
      description: t('Could not connect to lens protocol.'),
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    })
    setIsLoading(false)
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
          isDisabled={isLoading || global.profile && global.profile.eth_address}
        >
          {global.profile.eth_address.slice(0, 5) + "..." + global.profile.eth_address.slice(global.profile.eth_address.length - 4)}
        </Button>
      )}
      {!global.profile && (
        <Popover
          returnFocusOnClose={false}
          isOpen={isPopoverOpen}
          onClose={onPopoverClose}
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
              onClick={() => onModalOpen()}
              isDisabled={isLoading || global.profile && global.profile.eth_address}
            >
              {t("Login")}
            </Button>

          </PopoverTrigger>
          <PopoverContent width={{ base: '260px', md: 'full' }} pr={{ base: '0px', md: '1.5em' }}>
            <PopoverArrow />
            <PopoverCloseButton ml="1.5em" />
            <PopoverBody>
              {t("Connect with your wallet and start earning crypto or hiring with your cryptos")}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}

      <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose a connection method</ModalHeader>
          <ModalCloseButton isDisabled={isLoading} />
          <ModalBody pb={6}>
            {isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <>
                <Center>
                  <Box mt="1em">

                    <Button leftIcon={<Image
                      alt="Img Item"
                      height={'25px'}
                      width={'20px'}
                      objectFit={'fill'}
                      src={'/static/images/poh.png'}
                    />} rounded={"full"} fontSize={"18px"} fontWeight={"light"} colorScheme='teal' size='lg' w="226px" onClick={() => onConnectPoh()}>
                      Sign in Poh
                    </Button>
                  </Box>
                </Center>
                <Center>
                  <Box mt="2em" onClick={() => onConnectLens()}>
                    <SignInWithLens size={"large"} theme={"default"}
                      onSignIn={onSignIn} onError={errorLens}
                    />
                  </Box>
                </Center>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button isDisabled={isLoading} onClick={onModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonConnect;
