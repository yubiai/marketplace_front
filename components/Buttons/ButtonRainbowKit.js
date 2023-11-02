import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Center,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaWallet } from 'react-icons/fa';
import { useConnect } from 'wagmi'

export const ButtonRainbowkit = ({ t }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { connectors, connect } = useConnect();
    const sequenceConnector = connectors.find((connector) => connector.id === 'sequence')

    return (
        <>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted
                }) => {
                    const connectRainbow = () => {
                        openConnectModal();
                        onClose();
                        return;
                    }

                    const connectSequence = () => {
                        connect({ connector: sequenceConnector })
                        onClose();
                        return;
                    }
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
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <Popover isOpen={true} isLazy >
                                            <PopoverTrigger>
                                                <Button onClick={onOpen} leftIcon={<FaWallet />} bg="white" color={"#00ABD1"}>
                                                    Connect
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverHeader>{t("Welcome")}</PopoverHeader>
                                                <PopoverBody>{t("MsgWelcome")}</PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }
                                if (chain.unsupported) {
                                    return (
                                        <Button onClick={openChainModal} type="button" bg="white" color={"#00ABD1"}>
                                            {t("Wrong network")}
                                        </Button>
                                    );
                                }
                                return (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <Button
                                            onClick={openChainModal}
                                            style={{ display: 'flex' }}
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
                                        <Button onClick={openAccountModal} fontSize={{ base: "11px", md: "15px" }} type="button">
                                            {account.displayName}
                                            {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}
                                        </Button>
                                    </div>
                                );
                            })()}
                            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered={true}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <Center mt="2em">
                                            <Button onClick={() => connectSequence()} leftIcon={<FaWallet />} bg="#00abd1" color={"white"}>
                                                Connect with your email
                                            </Button>
                                        </Center>
                                        <Center mt="1em">
                                            <Button bg="transparent" onClick={() => connectRainbow()} type="button">Or connect with a crypto wallet</Button>
                                        </Center>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </div>
                    );
                }}
            </ConnectButton.Custom>


        </>
    );
};