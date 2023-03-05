import {
    Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Text,
    Textarea,
    useToast,
    Spinner,
    Flex
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { reportService } from "../../services/reportService";

const ButtonNewReportQA = ({ reference, type, userId, owner, token, t }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { handleSubmit, register, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const [countMotive, setCountMotive] = useState(0);
    const MIN_MOTIVE_LENGTH = 15;
    const MAX_MOTIVE_LENGTH = 72;

    const [countDescription, setCountDescription] = useState(0);
    const MIN_DESCRIPTION_LENGTH = 30;
    const MAX_DESCRIPTION_LENGTH = 800;

    const onSubmit = async (data) => {

        setLoading(true);
        const newData = {
            user_id: userId,
            type: type,
            reference: reference,
            description: data.description,
            motive: data.motive
        }

        try {
            const resultReport = await reportService.newReport(newData, token);
            if(resultReport.data && resultReport.data.exist === true){
                onClose();
                reset();
                setLoading(false);
                toast({
                    title: t("Report"),
                    description: t(`Your report has already been sent, you can't report the same ${type && type.toLowerCase()} again`),
                    position: 'top-right',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
                setCountMotive(0);
                setCountDescription(0);
                return;
            }

            onClose();
            reset();
            setLoading(false);
            toast({
                title: t("Report"),
                description: t("Report was completed successfully"),
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setCountMotive(0);
            setCountDescription(0);
            return;
        } catch (err) {
            console.error(err);
            toast({
                title: t("Report"),
                description: t("Report could not be sent."),
                position: 'top-right',
                status: 'warning',
                duration: 3000,
                isClosable: true
            });
            setCountMotive(0);
            setCountDescription(0);
            return
        }
    }

    return (
        <>
            {userId && token && !owner && !loading ? (
                <Text cursor={"pointer"} ml="5px" fontSize={"sm"} color="red.200" onClick={() => onOpen()}>{t("Report")}</Text>
            ) : null}
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>{t("Report")} {type === "Question" ? t("Question") : t("Answer")}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black">{t("Motive")}</FormLabel>

                                <Input
                                    placeholder={t("Motive is required, minimum 15 characters and maximum 72 characters")}
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    bg="white"
                                    {...register('motive', {
                                        required: true, minLength: MIN_MOTIVE_LENGTH, maxLength: MAX_MOTIVE_LENGTH, onChange: (e) => { setCountMotive(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>Characters: <Text color={countMotive < MIN_MOTIVE_LENGTH || countMotive > MAX_MOTIVE_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countMotive}</Text> / {MAX_MOTIVE_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.motive?.type === 'required' && t("Description is Required")}</Text>
                                <Text color="red" m="5px">{errors.motive?.type === 'minLength' && t("Minimum required characters are 15")}</Text>
                                <Text color="red" m="5px">{errors.motive?.type === 'maxLength' && t("Maximum required characters are 72")}</Text>
                            </FormControl>
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black">{t("Description")}</FormLabel>
                                <Textarea
                                    placeholder={t("Description is required, minimum 30 characters and maximum 800 characters")}
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    bg="white"
                                    {...register('description', {
                                        required: true, minLength: MIN_DESCRIPTION_LENGTH, maxLength: MAX_DESCRIPTION_LENGTH, onChange: (e) => { setCountDescription(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>Characters: <Text color={countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countDescription}</Text> / {MAX_DESCRIPTION_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.description?.type === 'required' && t("Description is Required")}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'minLength' && t("Minimum required characters are 30")}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'maxLength' && t("Maximum required characters are 400")}</Text>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            {loading ? (
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="blue.500"
                                    size="md"
                                />
                            ) : (
                                <>
                                    <Button backgroundColor={'#00abd1'}
                                        color={'white'} mr={3} type="submit">
                                        {t("Send")}
                                    </Button>
                                    <Button onClick={onClose}>{t("Cancel")}</Button>
                                </>
                            )}

                        </ModalFooter>
                    </form>
                </ModalContent>

            </Modal>
        </>
    )
}

export default ButtonNewReportQA;