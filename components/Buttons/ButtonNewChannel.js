import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react";
import { MdChat } from "react-icons/md"
import { channelService } from "../../services/channelService";
import { useRouter } from "next/router";

const ButtonNewChannel = ({ buyer, seller, item_id, profile, t }) => {
    const toast = useToast();
    const router = useRouter()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const newChannel = async () => {
        setLoading(true)
        try {

            const verifyChannel = await channelService.findChannel({
                buyer, seller, item_id
            }, profile.token);

            console.log(verifyChannel, "verifyChannel");

            if (verifyChannel && verifyChannel.data && verifyChannel.data.id) {
                return router.push(`/profile/mailboxs/id/${verifyChannel.data.id}`)
            } else {
                const res = await channelService.createChannel(
                    {
                        buyer,
                        seller,
                        item_id
                    },
                    profile.token
                );
                if (res && res.data && res.data.result && res.data.result._id) {
                    return router.push(`/profile/mailboxs/id/${res.data.result._id}`)
                } else {
                    throw "Channel Error"
                }

            }

        } catch (error) {

            setLoading(false);
            onClose();
            toast({
                title: t('Error Chat'),
                description: t('Error starting a chat'),
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            console.error(error);
            return
        }
    }

    return (
        <>
            {profile && profile._id && profile.token && (
                <Box>
                    <Tooltip label={t("Start a chat")} aria-label='Button New Channel' placement='top' bg={"#00abd1"} color={"white"}>
                        <Button
                            mb="1em"
                            backgroundColor={'green.400'}
                            color={'white'}
                            rounded={'full'}
                            cursor={'pointer'}
                            onClick={() => onOpen()}
                            float={"right"}
                            _hover={{
                                backgroundColor: 'green.200'
                            }}
                        >
                            <MdChat />
                        </Button>
                    </Tooltip>
                </Box>
            )}

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t("Start a chat with the seller")}</ModalHeader>
                    {loading ? (
                        <>
                            <Center m="1em">
                                <Spinner />
                            </Center>
                        </>
                    ) : (
                        <>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {t("Are you sure you want to start a conversation?")}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={() => newChannel()}>
                                    {t("Yes")}
                                </Button>
                                <Button onClick={onClose}>No</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ButtonNewChannel;