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
    Text
} from '@chakra-ui/react';
import { dpolicyService } from '../../services/dpolicyService';
import RichTextReadOnly from '../Utils/richTextReadOnly';
import { useRouter } from 'next/router';
import moment from 'moment';

const ButtonStartClaim = ({ transactionMeta, token }) => {
    const toast = useToast();
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);
    const [disputePolicy, setDisputePolicy] = useState(null);

    // Overlay Modal
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.700'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    );

    // On Modal Dispute Policy
    const onModalDisputePolicy = async () => {
        const lastDPolicy = await dpolicyService.getDPolicyLast(token);

        if (!lastDPolicy.data) {
            toast({
                title: 'Failed Start Claim',
                description: 'The dispute policy is not available, please try again later.',
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }

        setDisputePolicy(lastDPolicy.data);
        onOpen();
        return
    }

    // Reject Policy Dispute
    const rejectTerms = () => {
        toast({
            title: 'Failed Start Claim',
            description: 'The dispute policy must be accepted to claim.',
            position: 'top-right',
            status: 'warning',
            duration: 5000,
            isClosable: true,
        })
        onClose();
        return
    }

    // Confirm Policy Dispute
    const confirmDPolicy = () => {
        router.push(`/profile/evidences/new/${transactionMeta.transactionHash}`)
    }

    return (
        <>
            <Button
                size="md" bg="green.500" color="white" _hover={{ bg: "gray.400" }}
                borderRadius="0.375rem" height="40px" width="120px"
                fontWeight="bold"
                onClick={() => onModalDisputePolicy()}>
                Start claim
            </Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} scrollBehavior={'inside'} size={"6xl"}>
                <OverlayOne />
                <ModalContent bg="white" color="black">
                    <ModalHeader>Yubiai Service Policy
                        <Text fontStyle={"italic"}>Update At: {moment(disputePolicy && disputePolicy.updateAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>

                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <RichTextReadOnly text={disputePolicy && disputePolicy.text} />
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => rejectTerms()} mr="1em">Reject</Button>

                        <Button colorScheme='blue' mr={3} onClick={() => confirmDPolicy()}>
                            Accept
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ButtonStartClaim;
