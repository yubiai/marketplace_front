import {
    Button, Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ModalOverlay,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { notiService } from "../../services/notiService";
import useTranslation from 'next-translate/useTranslation';

const ButtonMarkAllAsRead = ({ onClosePopover, mutate }) => {
    const global = useGlobal();
    const dispatch = useDispatchGlobal()
    const { t } = useTranslation("notifications");
    const [loading, SetLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const markAllRead = async () => {
        try {
            await notiService.updateNotisAllSeenFalseByUserId(global.profile._id, global.profile.token);
            await mutate()
            SetLoading(false);
            onClosePopover && onClosePopover();
            dispatch({
                type: 'ACTIVE_NOTIFICATIONS'
            })
            onClose();
            return
        } catch (err) {
            console.error(err);
            await mutate()
            onClosePopover && onClosePopover();
            onClose();
            SetLoading(false);
            return
        }
    };

    // Overlay Modal
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.700'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    return (
        <>
            <Button
                float="right"
                backgroundColor={'#00abd1'}
                color={'white'}
                size={'sm'}
                mr={'2em'}
                rounded={'full'}
                cursor={'pointer'} onClick={() => { onOpen() }}
            >{t("Mark all as read")}</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"md"}>
                <OverlayOne />

                <ModalContent bg="white" color="black">

                    <ModalHeader>{t("Mark all notifications as read")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {t("Are you sure you want to mark all your notifications as read?")}
                    </ModalBody>

                    {loading ? (<Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="md"
                    />) : (
                        <>
                            <ModalFooter>
                                <Button onClick={() => onClose()} mr="1em">{t("Cancel")}</Button>
                                <Button colorScheme='blue' mr={3} onClick={() => markAllRead()}>
                                    {t("Accept")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ButtonMarkAllAsRead;