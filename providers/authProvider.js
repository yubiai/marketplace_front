import { useEffect, useState } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useAccount, useDisconnect } from 'wagmi';

import {
  SignInWithLens
} from '@lens-protocol/widgets-react';
import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useTour } from '@reactour/tour'

export const AuthProvider = ({ children, status }) => {
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const [isLoading, setIsLoading] = useState(false);
  const { setIsOpen } = useTour();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { address, connector, isConnected } = useAccount()

  const { disconnect } = useDisconnect()

  // Al cerrar el modal de Auth metamask por ahora lens.
  function onCloseModal() {
    disconnect();
    onClose();
    return router.replace('/logout');
  }

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
    return
  }

  useEffect(() => {
    const verifyAuth = async () => {
      console.log("--- Se Activo el verifyAuth----", status)
      console.log(connector, "connector")
      console.log(isConnected, "isConnected")
      if (connector && connector.id && !status || status === "authenticated") {
        if (connector && connector.id === "metaMask") {
          onOpen();
          return
        }

        if (connector && connector.id === "sequence") {
          console.log("Se logueo con sequence", connector);

          setIsLoading(true)

          try {
            // Step 1 - Login SQ
            const res = await profileService.loginSequence(address);

            dispatch({
              type: 'AUTHERROR',
              payload: null
            });

            const token = res.data.token;
            const profileData = res.data.data;
            console.log(profileData, "profileData")
            // Step 2 - auth cookies
            authGlobalAndCookies(profileData, token);
            // JoyTour Initial
            if (profileData && profileData.permission && profileData.permission === 1) {
              setTimeout(() => {
                onClose();
                setIsOpen(true);
                setIsLoading(false);
                return
              }, 500);

              return
            }
            dispatch({
              type: 'WALLETACTIVE',
              payload: 'sequence',
            })
            onClose();
            setIsLoading(false);
            return
          } catch (error) {
            console.error(error, "error");
            onClose();
            setIsLoading(false);
            return
          }
        }

        console.log("no auth wagmi")
        onClose();
        return
      }
    }
      verifyAuth();
    }, [connector, status]);

  // Al iniciar con lens protocol
  async function onSignIn(tokens, profile) {
    setIsLoading(true)
    if (tokens && profile) {
      try {

        // step 1 - Login
        const res = await profileService.loginLens({
          profile: profile,
          tokenLens: tokens.accessToken
        });

        dispatch({
          type: 'AUTHERROR',
          payload: null
        });

        const token = res.data.token;
        const profileData = res.data.data;

        // step 2 - auth cookies
        authGlobalAndCookies(profileData, token);
        // JoyTour Initial
        if (profileData && profileData.permission && profileData.permission === 1) {
          setTimeout(() => {
            onClose();
            setIsOpen(true);
            setIsLoading(false);
            return
          }, 500);

          return
        }
        dispatch({
          type: 'WALLETACTIVE',
          payload: 'sequence',
        })
        onClose();
        setIsLoading(false);
        return
      } catch (error) {
        console.error(error, "error");
        onClose();
        setIsLoading(false);
        return
      }
    } else {
      onCloseModal();
      setIsLoading(false);
      return
    }
  }


  return <>
    {children}
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Auth with Metamask</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Center>
            {isLoading ? (
              <Box h="120px">
                <Center>
                  <Spinner />
                </Center>
              </Box>
            ) : (
              <SignInWithLens size={"large"} theme={"default"}
                onSignIn={onSignIn} onError={onCloseModal}
              />
            )}
          </Center>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal></>
}

export default AuthProvider
