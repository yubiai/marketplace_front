import {
    Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, useDisclosure,
    //useMediaQuery
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Center,
    Spinner,
    Box
} from '@chakra-ui/react';
//import Cookies from 'js-cookie';
import { useGlobal } from "../../providers/globalProvider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonConnect from './ButtonConnect';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const ButtonLogin = () => {
/*     const toast = useToast();
    const dispatch = useDispatchGlobal(); */
    const global = useGlobal();
    const { t } = useTranslation("navbar");
    const { isConnected } = useAccount();


    const [isLoading, /* setIsLoading */] = useState(false);

    const { isOpen: isPopoverOpen, onToggle: onPopoverToggle, onClose: onPopoverClose } = useDisclosure();
    const { isOpen: isModalOpen, onClose: onModalCloseFirst } = useDisclosure();
    //const { setIsOpen } = useTour();

    //const disableActions = !isConnected

    useEffect(() => {
        // Toggle Popover
        onPopoverToggle()
        return
    }, [global.profile]);

    useEffect(() => {
        if (isConnected) {
            console.log('Wallet connected!')
        } else {
            console.log("Wallet no coneccted")
        }
    }, [isConnected])
/* 
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
    } */

    // SQ
    
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
                        <ConnectButton.Custom>
                            {({
                                account,
                                chain,
                                openAccountModal,
                                openChainModal,
                                openConnectModal,
                                authenticationStatus,
                                mounted,
                            }) => {
                                // Note: If your app doesn't use authentication, you
                                // can remove all 'authenticationStatus' checks
                                const ready = mounted && authenticationStatus !== 'loading';
                                const connected =
                                    ready &&
                                    account &&
                                    chain &&
                                    (!authenticationStatus ||
                                        authenticationStatus === 'authenticated');

                                return (
                                    <div
                                        {...(!ready && {
                                            'aria-hidden': true,
                                            'style': {
                                                opacity: 0,
                                                pointerEvents: 'none',
                                                userSelect: 'none',
                                            }
                                        })}
                                    >
                                        {(() => {
                                            if (!connected) {
                                                return (
                                                    <Button style={{ marginBottom: '20px' }} onClick={openConnectModal} type="button">
                                                        Connect Wallet
                                                    </Button>
                                                );
                                            }

                                            if (chain.unsupported) {
                                                return (
                                                    <Button onClick={openChainModal} type="button">
                                                        Wrong network
                                                    </Button>
                                                );
                                            }

                                            return (
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <Button
                                                        onClick={openChainModal}
                                                        style={{ display: 'flex', alignItems: 'center' }}
                                                        type="button"
                                                    >
                                                        {chain.hasIcon && (
                                                            <div
                                                                style={{
                                                                    background: chain.iconBackground,
                                                                    width: 12,
                                                                    height: 12,
                                                                    borderRadius: 999,
                                                                    overflow: 'hidden',
                                                                    marginRight: 4,
                                                                }}
                                                            >
                                                                {chain.iconUrl && (
                                                                    <img
                                                                        alt={chain.name ?? 'Chain icon'}
                                                                        src={chain.iconUrl}
                                                                        style={{ width: 12, height: 12 }}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                        {chain.name}
                                                    </Button>

                                                    <Button onClick={openAccountModal} type="button">
                                                        {account.displayName}
                                                        {account.displayBalance
                                                            ? ` (${account.displayBalance})`
                                                            : ''}
                                                    </Button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            }}
                        </ConnectButton.Custom>

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