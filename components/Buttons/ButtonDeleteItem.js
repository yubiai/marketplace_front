import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
    Spinner,
    Center,
    useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { publishService } from '../../services/publishService';

const ButtonDeleteItem = ({ itemId, token, t }) => {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef()

    const onDeleteItem = async () => {
        try {
            setLoading(true);

            await publishService.updateStatusItem(itemId, {
                status: 6
            }, token);

            router.push("/profile/listings");
            return
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: t('Error trying to delete item'),
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
            setLoading(false);
            onClose();
            return;
        }
    }

    return (
        <>
            <Button colorScheme='red' onClick={onOpen}>
                {t("Delete Item")}
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        {loading ? (
                            <Center height={"2em"}>
                                <Spinner />
                            </Center>
                        ) : (
                            <>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    {t("Delete Item")}
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    {t("Are you sure you want to delete this item")}
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        {t("Cancel")}
                                    </Button>
                                    <Button colorScheme='red' onClick={() => onDeleteItem()} ml={3}>
                                        {t("Delete")}
                                    </Button>
                                </AlertDialogFooter>
                            </>
                        )}
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ButtonDeleteItem;