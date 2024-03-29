import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Text,
    Portal,
    useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineChat } from 'react-icons/md'
import { messageFeedback } from '../../services/msgFeedbackService';
import useTranslation from 'next-translate/useTranslation';

const ButtonFeedback = () => {
    const initRef = useRef()
    const toast = useToast();
    const { t } = useTranslation("help");

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const onSubmit = async (data) => {
        try {
            await messageFeedback.newMessageFeedback(data);
            toast({
                title: t('Message Feedback'),
                description: t('Feedback message was sent.'),
                position: 'top-right',
                status: 'success',
                duration: 2000,
                isClosable: true
            })
            reset()
            return
        } catch (err) {
            toast({
                title: t('Message Feedback'),
                description: t('Error sending message'),
                position: 'top-right',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
            console.log(err);
            return
        }
    };

    return (
        <>
            <Popover closeOnBlur={false} placement='left-start' initialFocusRef={initRef}>
                {({ onClose }) => (
                    <>
                        <PopoverTrigger>
                            <Button color={'white'}
                                bg={'#00abd1'} position={"fixed"} bottom="5" right="2" fontSize={"1.5em"} _hover={{
                                    bg: "blue.700"
                                }}><MdOutlineChat /></Button>
                        </PopoverTrigger>
                        <Portal>
                            <PopoverContent>
                                <PopoverHeader fontWeight='semibold'>{t("Reach out to us with any questions, suggestions or bugs.")}
                                    {t("We re available on all weekdays and usually reply within one working day.")}</PopoverHeader>
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        <FormControl isRequired>

                                            <FormLabel mt="5px">{t("Title")}</FormLabel>
                                            <Input id="title"
                                                type="text" placeholder={t('Add a title')} _placeholder={{ color: 'gray.400' }}
                                                {...register('title', { required: true, maxLength: 80, minLength: 10 })} />
                                            <Text color="red.300">{errors && errors.title && t("Maximum of 80 characters and min 10")}</Text>


                                            <FormLabel mt="5px">{t("Email")}</FormLabel>
                                            <Input id="email"
                                                type="text" placeholder={t('Add your email to be able to reply')} _placeholder={{ color: 'gray.400' }}
                                                {...register('email', {
                                                    required: true,
                                                    pattern:
                                                        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                })} />
                                            <Text color="red.300">{errors && errors.email && "Bad email format"}</Text>

                                            <FormLabel mt="1em">{t("How can we help?")}</FormLabel>
                                            <Textarea {...register("message", { required: true, max: 600, min: 50, maxLength: 600, minLength: 50 })} placeholder={t("Add the message you want us to read")} _placeholder={{ color: 'gray.400' }}
                                            />
                                            <Text color="red.300">{errors && errors.message && t("Maximum 600 characters and min 50")}</Text>

                                        </FormControl>
                                        <Button color={'white'}
                                            bg={'#00abd1'} mt="1em" float="center" width={"100%"} type="submit" onClick={onClose} ref={initRef}>{t("Submit")}</Button>
                                    </form>

                                </PopoverBody>
                            </PopoverContent>
                        </Portal>
                    </>
                )}
            </Popover>

        </>
    )
}

export default ButtonFeedback;