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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { notiService } from "../../services/notiService";

const ButtonMarkAllAsRead = () => {
    const global = useGlobal();
    const router = useRouter();
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
            const result = await notiService.updateNotisAllSeenFalseByUserId(global.profile._id, global.profile.token);
            console.log(result);
            dispatch({
                type: 'SET_NOTIFICATIONS',
                payload: {}
            })
            getNotiSeenFalse()
            SetLoading(false)
            onClose()
            router.push("/profile")
            return
        } catch (err) {
            console.error(err);
            SetLoading(false)
            onClose()
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
                rounded={'full'}
                cursor={'pointer'} onClick={() => { onOpen() }}
                disabled={!notiFalse}
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