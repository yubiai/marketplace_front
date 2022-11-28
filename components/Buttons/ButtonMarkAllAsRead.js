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
import { useEffect, useState } from "react";
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { notiService } from "../../services/notiService";

const ButtonMarkAllAsRead = ({ onClosePopover, mutate }) => {
    const global = useGlobal();
    const dispatch = useDispatchGlobal();
    const [notiFalse, SetNotiFalse] = useState(false);
    const [loading, SetLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getNotiSeenFalse = async () => {
        try {
            const result = await notiService.getNotisSeenFalseById(global.profile._id, global.profile.token);
            if (result.data.length > 0) {
                SetNotiFalse(true)
            }

            if (!result.data || result.data.length === 0) {
                SetNotiFalse(false)
            }

            mutate()

            return
        } catch (err) {
            console.error(err);
            return
        }
    };

    useEffect(() => {
        getNotiSeenFalse()
        return
    }, [global.notificationsList])

    const markAllRead = async () => {

        try {
            await notiService.updateNotisAllSeenFalseByUserId(global.profile._id, global.profile.token);
            dispatch({
                type: 'SET_NOTIFICATIONS',
                payload: {}
            })
            getNotiSeenFalse();
            SetLoading(false);
            onClosePopover && onClosePopover();
            onClose();
            return
        } catch (err) {
            console.error(err);
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
                rounded={'full'} disabled={!notiFalse}
                cursor={'pointer'} onClick={() => { onOpen() }}
            >Mark all as read</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"md"}>
                <OverlayOne />

                <ModalContent bg="white" color="black">

                    <ModalHeader>Mark all notifications as read</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        Are you sure you want to mark all your notifications as read?
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
                                <Button onClick={() => onClose()} mr="1em">Cancel</Button>
                                <Button colorScheme='blue' mr={3} onClick={() => markAllRead()}>
                                    Accept
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