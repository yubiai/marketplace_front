import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Center,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaWallet } from 'react-icons/fa';
import { useConnect } from 'wagmi'

export const ButtonRainbowkit = () => {
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
                    console.log(authenticationStatus, "authenticationStatus")
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
                                        <Button onClick={onOpen} leftIcon={<FaWallet />} bg="#00abd1" color={"white"}>
                                            Connect
                                        </Button>
                                    );
                                }
                                if (chain.unsupported) {
                                    return (
                                        <button onClick={openChainModal} type="button">
                                            Wrong network
                                        </button>
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
                                        <Button onClick={openAccountModal} type="button">
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