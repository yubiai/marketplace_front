import Cookies from 'js-cookie'
import { useTour } from "@reactour/tour";
import { ethers } from 'ethers';
import React, { useState } from 'react';
import {
  Button, useToast, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter
  //useMediaQuery
} from '@chakra-ui/react'

import { profileService } from '../../services/profileService'
import { useDisclosure } from '@chakra-ui/react';

import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
//import { useEffect } from 'react';
import { connectWallet, signInWithEthereum, verifyNetwork } from '../../utils/connectWeb3';

import useTranslation from 'next-translate/useTranslation';
import { SignInWithLens } from '@lens-protocol/widgets-react';


//let loading = false;

const ButtonConnect = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const global = useGlobal();
  const { t } = useTranslation("navbar");
  //const { isOpen, onToggle, onClose } = useDisclosure()
  const modalDisclosure = useDisclosure();
  const isModalOpen = modalDisclosure.isOpen;
  const onModalOpen = modalDisclosure.onOpen;
  const onModalClose = modalDisclosure.onClose;

  const { setIsOpen } = useTour();
  async function onSignIn(tokens, profile) {
    console.log('tokens: ', tokens);
    console.log('profile: ', profile);

    if (profile.eth_address) {
      authGlobalAndCookiesPoH(profile, tokens.access_token);
    } else {
      authGlobalAndCookiesLens(profile, tokens.access_token);
    }
  }
  const authGlobalAndCookiesPoH = (profile, token) => {

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
  const authGlobalAndCookiesLens = (profile, token) => {
    console.log("Lens profile data:", profile);
    if (profile) {
      const yubiaiLS = {
        token: token,
        wallet: profile.ownedBy
      };
      console.log("Lens profile ownedBy", profile.ownedBy)
      Cookies.set('YubiaiLens', token, { expires: 1, secure: true });

      localStorage.setItem('YubiaiLens', JSON.stringify(yubiaiLS))

      // Dispatch an action to update the user state
      dispatch({
        type: 'UPDATE_USER',
        payload: {
          ...global,
          isAuthenticated: true,
          profile: {
            ...profile
          },
          token: token
        },
      });
    } else {
      toast({
        title: t("Failed to login."),
        description: t("Couldn't find the necessary property in the Lens profile data."),
        position: "top-right",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /*useEffect(() => {
    onToggle()
    return
  }, [global.profile]); */

  const onConnect = async () => {
    console.log("Inicio on connect");
    setLoading(true);
    //loading = true;

    const provider = new ethers.providers.Web3Provider(window && window.location ? window.ethereum : "null");
    const signer = provider.getSigner();

    // 1 - Connect app
    await connectWallet(provider)

    // 2 - Verify NetWork
    const confirmNetwork = await verifyNetwork();

    if (!confirmNetwork) {
      console.error("Error the network");
      toast({
        title: t('Failed to login.'),
        description: t('Wrong network, please change your network on metamask.'),
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return;
      //loading = false;
      //return
    }

    // 3 - Create Sign
    const resultSignIn = await signInWithEthereum(signer);

    if (!resultSignIn && !resultSignIn.signature) {
      toast({
        title: t('Failed to login.'),
        description: t('User denied message signature.'),
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      //loading = false;
      setLoading(false);
      return
    }

    const { message, address, signature } = resultSignIn

    // 4 - Verify Signature
    await profileService.verifySignature(message, signature)
      .catch((err) => {
        console.error(err, "error")
        toast({
          title: t('Failed to login.'),
          description: t('User denied message signature.'),
          position: 'top-right',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        //loading = false;
        setLoading(false);
        return
      })

    // 5 - Login
    const res = await profileService.login(address)
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error) {
          console.error(err)
          toast({
            title: t('Failed to login.'),
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
          //loading = false;
          setLoading(false);
          return
        }
      })

    if (!res) {
      //loading = false;
      setLoading(false);
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

    authGlobalAndCookiesPoH(profile, token);
    // JoyTour Initial
    if (profile?.permission === 1) {
      setTimeout(() => {
        setIsOpen(true)
        return
      }, 500);

      return
    }

    //loading = false;
    setLoading(false);
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
          {global.profile && (global.profile.eth_address || global.profile.ownedBy) ? (
            <>
              {(global.profile.eth_address || global.profile.ownedBy).slice(0, 5)}...
              {(global.profile.eth_address || global.profile.ownedBy).slice(
                (global.profile.eth_address || global.profile.ownedBy).length - 4
              )}
            </>
          ) : (
            "Connect"
          )}
        </Button>
      )}
      {!global.profile && (
        <>
          <Button
            className={'step-connect'}
            backgroundColor={'white'}
            color={'#00abd1'}
            rounded={'full'}
            w="90%"
            cursor={'pointer'}
            onClick={onModalOpen}
            isDisabled={loading || global.profile && global.profile.eth_address}
          >
            {t("Connect")}
          </Button>

          <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{t("Choose a connection method")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Button
                  width="100%"
                  marginBottom="1rem"
                  onClick={() => {
                    onModalClose();
                    onConnect();
                  }}
                >
                  {t("Connect with Proof of Humanity")}
                </Button>
                <SignInWithLens onSignIn={onSignIn} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onModalClose}>
                  {t("Close")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default ButtonConnect;
