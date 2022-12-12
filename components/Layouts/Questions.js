import { Box, Button, Center, Flex, FormControl, FormLabel, Spinner, Text, Textarea, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { questionService } from "../../services/questionService";
import QuestionCard from "../Cards/QuestionCard";

const Questions = ({ item, profile_id, token }) => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const [viewQuestions, setViewQuestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [countQuestions, setCountQuestions] = useState(0);
    const limitQuery = 6;

    const toast = useToast();

    const getQuestionsCount = async () => {
        try {
            const result = await questionService.getQuestionsCountByItemId(item._id, token);
            if (result && result.data > 0) {
                setCountQuestions(result.data);
                return
            }
            return
        } catch (err) {
            console.error(err);
            return
        }
    }

    useEffect(() => {
        getQuestionsCount()
    }, [viewQuestions]);

    // Get Questions by Item Id
    const getQuestions = async (limit) => {

        try {
            setLoadingQuestions(true)
            const result = await questionService.getQuestionsByItemId(item._id, limit, token);

            if (result && result.data && result.data.length > 0) {
                setQuestions(result.data);
            }
            setLoadingQuestions(false)

            return
        } catch (err) {
            console.error(err);
            return
        }
    }

    // View Questions
    const onActiveViewQuestions = () => {
        getQuestions(limitQuery)
        setViewQuestions(true)
    }

    // New Question
    const onSubmit = async (data) => {

        setLoading(true)
        const newQuestion = {
            seller: item.seller._id,
            buyer: profile_id,
            itemId: item._id,
            question: data.question
        }

        try {
            await questionService.newQuestion(newQuestion, token);
            reset();
            toast({
                title: 'Question',
                description: 'Question was completed successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            getQuestionsCount()
            setViewQuestions(false)
            setLoading(false)
        } catch (err) {
            console.error(err);
            toast({
                title: 'Question',
                description: 'Error creating question.',
                position: 'top-right',
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
            getQuestionsCount()
            setViewQuestions(false)
            setLoading(false)
            return
        }
        return
    }

    return (
        <>
            {!profile_id || item && item.seller && item.seller._id !== profile_id && (
                <Box width={"100%"}>
                    <Text fontWeight={"semibold"}>Questions and answers</Text>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box>
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black">Ask the seller</FormLabel>
                                <Flex>
                                    <Textarea
                                        placeholder="Write your question..."
                                        _placeholder={{ color: 'gray.400' }}
                                        width={"80%"}
                                        color="gray.700"
                                        bg="white"
                                        {...register('question', { required: true, maxLength: 400, minLength: 50 })}
                                        isRequired
                                    />
                                    {loading ? (<Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="md"
                                    />) : (<Button ml="1em" width={"20%"} height={"50px"} fontSize={"1em"} bg="#00abd1" color="white" type="submit">
                                        Ask
                                    </Button>)}

                                </Flex>
                                <Text color="red" m="5px">{errors.question?.type === 'required' && "Description is Required"}</Text>
                                <Text color="red" m="5px">{errors.question?.type === 'minLength' && "Minimum required characters are 50"}</Text>
                                <Text color="red" m="5px">{errors.question?.type === 'maxLength' && "Maximum required characters are 400"}</Text>
                            </FormControl>
                        </Box>
                    </form>
                </Box>
            )}
            {!viewQuestions && (
                <Button mt="1em" bg='#00abd1' color={'white'} disabled={!countQuestions || countQuestions === 0} _hover={{
                    bg: "blue.300"
                }} onClick={() => onActiveViewQuestions()}>View Questions ({countQuestions})</Button>
            )}

            {viewQuestions && (
                <>
                    <Button mt="1em" bg='#00abd1' color={'white'} _hover={{
                        bg: "blue.300"
                    }} onClick={() => setViewQuestions(false)
                    } >Close Questions</Button>
                    <Box mt="1em">
                        {questions && questions.length && questions.map((question, i) => {

                            return (
                                <Box key={i}>
                                    <QuestionCard question={question} profile_id={profile_id} token={token} />
                                </Box>
                            )
                        })}
                    </Box>
                    {!loadingQuestions && countQuestions > limitQuery && countQuestions != questions.length ? (
                        <Box mt="1em" cursor={'pointer'}
                            onClick={() => getQuestions()
                            }>
                            <Text fontStyle={"italic"} >Ver Mas...</Text>

                        </Box>
                    ) : null}
                </>
            )}
            {loadingQuestions && (
                <Center>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="md"
                    />
                </Center>
            )}
        </>
    )

}

export default Questions;