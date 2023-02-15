import { Box, Button, Flex, FormControl, FormLabel, Spinner, Textarea, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWindowClose } from "react-icons/fa";
import { questionService } from "../../services/questionService";


const ButtonNewAnswer = ({ question, token, t }) => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const [activeNewAnswer, setActiveNewAnswer] = useState(false);

    // New Question
    const onSubmit = async (data) => {
        setLoading(true);
        const newAnswer = {
            answer: data.answer
        }

        try {
            await questionService.newAnswer(question._id, newAnswer, token);
            reset();
            toast({
                title: t("Answer"),
                description: t("The response was successfully sent"),
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            router.push(`/profile/questions/question/${question._id}`)
            return
        } catch (err) {
            console.error(err);
            toast({
                title: t("Question"),
                description: t("Error in response."),
                position: 'top-right',
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
            setLoading(false)
            return
        } 
    }

    return (
        <>
            {!activeNewAnswer && (
                <Box>
                    <Button onClick={() => setActiveNewAnswer(true)} backgroundColor={'#00abd1'}
                        color={'white'}
                        rounded={'full'}>
                        {t("Answer the question")}
                    </Button>
                </Box>
            )}
            {loading && (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                />
            )}
            {!loading && activeNewAnswer && (
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box>

                            <FormControl isRequired>
                                <Flex>
                                    <FormLabel mt="5px" color="black">{t("Answer the question")}</FormLabel>
                                    <Button onClick={() => setActiveNewAnswer(false) } bg="blue.400" color="white" size={"sm"} fontSize={"md"} float={"left"} _hover={{
                                        bg: "blue.100"
                                    }}>
                                        <FaWindowClose />
                                    </Button>
                                </Flex>

                                <Flex>
                                    <Textarea
                                        placeholder={t("Write your answer")}
                                        _placeholder={{ color: 'gray.400' }}
                                        width={"80%"}
                                        color="gray.700"
                                        bg="white"
                                        {...register('answer', { required: true, maxLength: 400, minLength: 50 })}
                                        isRequired
                                    />
                                    {loading ? (<Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="md"
                                    />) : (<Button ml="1em" width={"20%"} height={"50px"} fontSize={"1em"} bg="#00abd1" color="white" type="submit">
                                        {t("Answer")}
                                    </Button>)}

                                </Flex>
                                <Text color="red" m="5px">{errors.answer?.type === 'required' && t("Description is Required")}</Text>
                                <Text color="red" m="5px">{errors.answer?.type === 'minLength' && t("Minimum required characters are 50")}</Text>
                                <Text color="red" m="5px">{errors.answer?.type === 'maxLength' && t("Maximum required characters are 400")}</Text>
                            </FormControl>
                        </Box>
                    </form>
                </Box>
            )}
        </>
    )
}

export default ButtonNewAnswer;