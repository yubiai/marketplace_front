import { Alert, AlertIcon, Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { dealService } from "../../services/dealService";

const ValidateSignatureEvidence = ({ urlpdf, fileSignature }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [signatureValid, setSignatureValid] = useState(null);

    const [countPATHPDF, setCountPATHPDF] = useState(0);
    const MIN_PATHPDF_LENGTH = 20;
    const MAX_PATHPDF_LENGTH = 200;

    const validatePathPdf = (value) => {
        return value === urlpdf;
    }

    const [countSignature, setCountSignature] = useState(0);
    const MIN_SIGNATURE_LENGTH = 20;
    const MAX_SIGNATURE_LENGTH = 200;

    const validateSignatureInput = (value) => {
        return value === fileSignature;
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await dealService.validateSignature(data);

            if (response.status === 200) {
                setSignatureValid(response.data && response.data.signatureValid);
                setLoading(false);
            }

            return
        } catch (err) {
            console.error(err);
            return
        }
    }

    const onCloseModal = () => {
        reset();
        onClose();
        setSignatureValid(null);
        setCountPATHPDF(0);
        setCountSignature(0);
    }


    return (
        <>
            <Button mt="1em" backgroundColor={'#00abd1'}
                color={'white'} onClick={onOpen} _hover={{
                    backgroundColor: "blue.400"
                }}>Validate Signature</Button>

            <Modal closeOnOverlayClick={false} size={"5xl"} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Validate Signature</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody pb={6}>
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black" fontWeight={"bold"}>Path PDF (Example: /ipfs/xx/yyy.pdf)</FormLabel>
                                <Input
                                    placeholder={`Path PDF is required, minimum ${MIN_PATHPDF_LENGTH} characters and maximum ${MAX_PATHPDF_LENGTH} characters`}
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    isDisabled={signatureValid || loading}
                                    bg="white"
                                    {...register('pathpdf', {
                                        required: true, minLength: MIN_PATHPDF_LENGTH, maxLength: MAX_PATHPDF_LENGTH, validate: validatePathPdf, onChange: (e) => { setCountPATHPDF(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>{"Characters"} <Text color={countPATHPDF < MIN_PATHPDF_LENGTH || countPATHPDF > MAX_PATHPDF_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countPATHPDF}</Text> / {MAX_PATHPDF_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.pathpdf?.type === 'validate' && "Please enter a valid URL"}</Text>
                                <Text color="red" m="5px">{errors.pathpdf?.type === 'required' && "Url Pdf is required"}</Text>
                                <Text color="red" m="5px">{errors.pathpdf?.type === 'minLength' && `Minimum required characters are ${MIN_PATHPDF_LENGTH}`}</Text>
                                <Text color="red" m="5px">{errors.pathpdf?.type === 'maxLength' && `Maximum required characters are ${MAX_PATHPDF_LENGTH}`}</Text>
                            </FormControl>
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black" fontWeight={"bold"}>Signature</FormLabel>

                                <Input
                                    placeholder={`Signature is required, minimum ${MIN_SIGNATURE_LENGTH} characters and maximum ${MAX_SIGNATURE_LENGTH} characters`}
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    isDisabled={signatureValid || loading}
                                    bg="white"
                                    {...register('signature', {
                                        required: true, minLength: MIN_SIGNATURE_LENGTH, maxLength: MAX_SIGNATURE_LENGTH, validate: validateSignatureInput, onChange: (e) => { setCountSignature(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>{"Characters"} <Text color={countSignature < MIN_SIGNATURE_LENGTH || countSignature > MAX_SIGNATURE_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countSignature}</Text> / {MAX_SIGNATURE_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.signature?.type === 'validate' && "Please enter a valid signature"}</Text>
                                <Text color="red" m="5px">{errors.signature?.type === 'required' && "Signature is required"}</Text>
                                <Text color="red" m="5px">{errors.signature?.type === 'minLength' && `Minimum required characters are ${MIN_SIGNATURE_LENGTH}`}</Text>
                                <Text color="red" m="5px">{errors.signature?.type === 'maxLength' && `Maximum required characters are ${MAX_SIGNATURE_LENGTH}`}</Text>
                            </FormControl>
                            <Text mt="2em">They have to be the same as the evidence.</Text>
                            <Box mt="1em">
                                {signatureValid === true && (
                                    <Alert status='success'>
                                        <AlertIcon />
                                        The pdf is valid.
                                    </Alert>
                                )}
                                {signatureValid === false && (
                                    (
                                        <Alert status='error'>
                                            <AlertIcon />
                                            The pdf is not valid
                                        </Alert>
                                    )
                                )}
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Button isDisabled={signatureValid} colorScheme='blue' mr={3} type="submit">
                                        Validate
                                    </Button>
                                    <Button onClick={() => onCloseModal()}>Close</Button>
                                </>
                            )}
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ValidateSignatureEvidence;