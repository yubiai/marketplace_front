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
    Spinner,
} from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { sequence } from '0xsequence'
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonConnect from './ButtonConnect';
import { profileService } from '../../services/profileService';
import { useTour } from '@reactour/tour';


const ButtonLogin = () => {
    const toast = useToast();
    const dispatch = useDispatchGlobal();
    const global = useGlobal();
    const { t } = useTranslation("navbar");

    const [isLoading, setIsLoading] = useState(false);

    const { isOpen: isPopoverOpen, onToggle: onPopoverToggle, onClose: onPopoverClose } = useDisclosure()
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalCloseFirst } = useDisclosure()
    const { setIsOpen } = useTour();

    useEffect(() => {
        // Toggle Popover
        onPopoverToggle()
        return
    }, [global.profile]);

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

    // SQ
    // Configure Sequence wallet
    const walletAppURL = process.env.VITE_WALLET_APP_URL || 'https://sequence.app'
    const network = 'mainnet'

    sequence.initWallet(network, { walletAppURL })
    const defaultConnectOptions = {
        app: 'Yubiai',
        askForEmail: true
        // keepWalletOpened: true,
    }
    const [isWalletConnected, setIsWalletConnected] = useState(false)

    // Methods
    const connectSq = async (connectOptions) => {
        if (isWalletConnected) {

            console.log('Wallet already connected!')
            return
        }

        connectOptions = {
            ...defaultConnectOptions,
            ...connectOptions,
            settings: {
                ...defaultConnectOptions?.settings,
                ...connectOptions?.settings
            }
        }

        try {

            console.log('Connecting')
            const wallet = sequence.getWallet()

            const connectDetails = await wallet.connect(connectOptions)

            console.warn('connectDetails', { connectDetails })

            // Example of how to verify using ETHAuth via Sequence API
            if (connectOptions.authorize) {
                const api = new sequence.api.SequenceAPIClient('https://api.sequence.app')
                const { isValid } = await api.isValidETHAuthProof({
                    chainId: 'mainnet',
                    walletAddress: connectDetails.session.accountAddress,
                    ethAuthProofString: connectDetails.proof.proofString
                })
                console.log('isValid?', isValid)
            }
            if (connectDetails.connected) {
                console.log('Wallet connected!')
                try {
                    const res = await profileService.loginSequence(connectDetails.session.accountAddress, connectDetails.email);

                    dispatch({
                        type: 'AUTHERROR',
                        payload: null
                    });

                    const token = res.data.token;
                    const profileData = res.data.data;

                    authGlobalAndCookies(profileData, token);
                    // JoyTour Initial
                    if (profileData && profileData.permission && profileData.permission === 1) {
                        setTimeout(() => {
                            onModalCloseFirst();
                            setIsLoading(false);
                            setIsOpen(true);
                            return
                        }, 500);

                        return
                    }
                    setIsWalletConnected(true)

                    onModalCloseFirst();
                    setIsLoading(false);
                    return
                } catch (error) {
                    setIsWalletConnected(false)
                    onModalCloseFirst()
                    console.error(error);
                    return
                }

            } else {
                console.log('Failed to connect wallet - ' + connectDetails.error)
                onModalCloseFirst()
            }
        } catch (e) {
            console.error(e)
            return
        }
    }

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
            <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={onModalCloseFirst}>
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
                                    <Button rounded={"full"} fontSize={"18px"} fontWeight={"light"} colorScheme='teal' size='lg' w="100%" onClick={() => connectSq()}>
                                        {t("Connect email")}
                                    </Button>
                                </Center>
                                <Center>
                                    <Box mt="1em">
                                        <ButtonConnect onModalCloseFirst={onModalCloseFirst} />
                                    </Box>
                                </Center>
                            </>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button isDisabled={isLoading} onClick={onModalCloseFirst}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ButtonLogin;