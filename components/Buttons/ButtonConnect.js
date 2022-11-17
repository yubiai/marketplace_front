import Cookies from 'js-cookie'
import Joyride from 'react-joyride';
import { useState, useRef } from 'react'
import { useTour } from "@reactour/tour";

import {
  Button, useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react'

import { loginMetamask, verifyNetwork } from '../../utils/ethereum'
import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { termService } from '../../services/termService'
import { stepsJoyride } from '../../utils/tourGuideUtils'
import RichTextReadOnly from '../Utils/richTextReadOnly';

const ButtonConnect = () => {
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const global = useGlobal();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  const [term, setTerm] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [tokenData, setTokenData] = useState(null);

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

    if(!res){
      return
    }

    dispatch({
      type: 'AUTHERROR',
      payload: null
    });

    const token = res.data.token;
    const profile = res.data.data;

    // Check if in the profile you agree with this term
    const lastTerms = await termService.getTermsLast(token);

    const verifyTerms = new Promise((resolve, reject) => {
      try {
        const result = profile.terms.find((term) => term && term.idTerm == lastTerms.data._id);
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })

    await verifyTerms
      .then((res) => {
        if (res) {
          authGlobalAndCookies(profile, token);
          // JoyTour Initial
          if (profile?.permission === 1) {
            setTimeout(() => {
              setIsOpen(true)
              return
            }, 500);
          }
          return
        } else {
          setProfileData(profile)
          setTokenData(token)
          setTerm(lastTerms.data)
          onOpen()
          return
        }
      })
      .catch((err) => {
        console.error(err, "ee");
        return
      })

    return
  }

  // Overlay Modal
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.700'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  // Confirm
  const confirmTerms = async () => {
    try {
      await profileService.addTerms(profileData._id, term, tokenData)
      authGlobalAndCookies(profileData, tokenData);
      onClose();
      // JoyTour Initial
      if (profileData.permission === 1) {
        setTimeout(() => {
          setIsOpen(true)
          return
        }, 500);
      }
    } catch (err) {
      console.log(err);
      return
    }
  }

  // Reject
  const rejectTerms = () => {
    toast({
      title: 'Failed to login.',
      description: 'In order to connect you must accept the terms and conditions.',
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    })
    onClose();
    return
  }

  const [isLargerThanmd] = useMediaQuery('(min-width: 768px)')

  return (
    <>
      <Joyride
        steps={stepsJoyride}
        run={!global.profile && isLargerThanmd}
      />
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
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} scrollBehavior={'inside'} size={"6xl"}>
        <OverlayOne />
        <ModalContent bg="white" color="black">
          <ModalHeader>Terms and Conditions</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <RichTextReadOnly text={term && term.text} />
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => rejectTerms()} mr="1em">Reject</Button>

            <Button colorScheme='blue' mr={3} onClick={() => confirmTerms()}>
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonConnect
