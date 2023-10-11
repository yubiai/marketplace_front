import React, { useRef, useState } from 'react';
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
    Text,
    Spinner,
    Center
} from '@chakra-ui/react';
import { dpolicyService } from '../../services/dpolicyService';
import RichTextReadOnly from '../Utils/richTextReadOnly';
import { useRouter } from 'next/router';
import moment from 'moment';

const ButtonStartClaim = ({ transactionMeta, profile, t}) => {
    const toast = useToast();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);
    const [disputePolicy, setDisputePolicy] = useState(null);
    const [loading, setLoading] = useState(false);

    // Overlay Modal
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.700'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    );

    // On Modal Dispute Policy
    const onModalDisputePolicy = async () => {

        try {
            // Check if the user accepted the last dispute policy for this order.
            const resultVerify = await dpolicyService.verifyAcceptDPolicy({
                user_id: profile._id,
                transactionHash: transactionMeta.transactionHash
            }, profile.token)

            if(resultVerify.status === 200 && resultVerify.data && resultVerify.data.accept === true){
                router.push(`/profile/evidences/new/${transactionMeta.transactionHash}`);
                return
            }

            // If you don't search for the latest dispute policy and open the modal
            const lastDPolicy = await dpolicyService.getDPolicyLast(profile.token);

            if (!lastDPolicy.data) {
                toast({
                    title: t('Failed Start Claim'),
                    description: t('The dispute policy is not available, please try again later.'),
                    position: 'top-right',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                })
            }
            console.log(lastDPolicy.data, "lastDPolicy.data")
            setDisputePolicy(lastDPolicy.data);
            onOpen();
            return

        } catch (err) {
            console.error(err);
            toast({
                title: t('Failed Start Claim'),
                description: t('verification error.'),
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            router.push("/")
            return
        }


    }

    // Reject Policy Dispute
    const rejectTerms = () => {
        toast({
            title: t('Failed Start Claim'),
            description: t('The dispute policy must be accepted to claim.'),
            position: 'top-right',
            status: 'warning',
            duration: 5000,
            isClosable: true,
        })
        onClose();
        return
    }

    // Confirm Policy Dispute in Profile
    const confirmDPolicy = async () => {

        if (!disputePolicy._id || !profile._id || !transactionMeta.transactionHash || !profile.token) {
            toast({
                title: t('Failed Start Claim'),
                description: t('Data missing.'),
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            onClose()
            return
        }

        const data = {
            idDisputepolicy: disputePolicy._id,
            user_id: profile._id,
            transactionHash: transactionMeta.transactionHash,
        }

        try {
            setLoading(true)
            await dpolicyService.acceptDPolicyByTransactionHash(data, profile.token);
            router.push(`/profile/evidences/new/${transactionMeta.transactionHash}`);
            return
        } catch (err) {
            console.error(err)
            toast({
                title: t('Failed Start Claim'),
                description: t('Failed to accept the Dispute Policy.'),
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            onClose();
            setLoading(false);
            return
        }

    }

    return (
        <>
            <Button
                size="md" bg="green.500" color="white" _hover={{ bg: "gray.400" }}
                borderRadius="0.375rem" height="40px" width={{base: "100%", md:"120px"}}
                fontWeight="bold"
                onClick={() => onModalDisputePolicy()}>
                {t("Start claim")}
            </Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} scrollBehavior={'outside'} size={"6xl"}>
                <OverlayOne />
                <ModalContent bg="white" color="black">
                    <ModalHeader>{t("Yubiai Service Policy")}
                        <Text fontStyle={"italic"}>{t("Update At")}: {moment(disputePolicy && disputePolicy.updateAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>

                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <RichTextReadOnly text={disputePolicy && disputePolicy.text} />
                    </ModalBody>

                    {loading ? (<Center m="1em">
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="md"
                        />
                    </Center>) : (<ModalFooter>
                        <Button onClick={() => rejectTerms()} mr="1em">{t("Reject")}</Button>

                        <Button colorScheme='blue' mr={3} onClick={() => confirmDPolicy()}>
                            {t("Accept")}
                        </Button>
                    </ModalFooter>)}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ButtonStartClaim;
