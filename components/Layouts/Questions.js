import { Box, Button, Flex, FormControl, FormLabel, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";


const Questions = ({ item }) => {
    const { handleSubmit, register, formState: { errors } } = useForm()

    const [viewQuestions, setViewQuestions] = useState(false);

    console.log(item)

    const getQuestions = async() =>{
        return
    }

    const onActiveViewQuestions = () => {
        getQuestions()
        setViewQuestions(true)
    }

    const onSubmit = async (data) => {
        console.log(data)
        return
    }

    return (
        <>
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
                                    {...register('question', { required: true, maxLength: 600, minLength: 10 })}
                                    isRequired
                                />
                                <Button ml="1em" width={"20%"} height={"50px"} fontSize={{base: "0.8em", md: "1em"}} bg="#00abd1" color="white" type="submit">
                                    Preguntar
                                </Button>
                            </Flex>
                            <Text color="red" m="5px">{errors.question?.type === 'required' && "Description is Required"}</Text>
                            <Text color="red" m="5px">{errors.question?.type === 'minLength' && "Minimum required characters are 50"}</Text>
                            <Text color="red" m="5px">{errors.question?.type === 'maxLength' && "Maximum required characters are 600"}</Text>
                        </FormControl>
                    </Box>
                </form>
            </Box>
            {!viewQuestions && (
                <Button mt="1em" bg='#00abd1' color={'white'} _hover={{
                    bg: "blue.300"
                }} onClick={() => onActiveViewQuestions()}>View Questions (XXX)</Button>
            )}
            {viewQuestions && (
                <>
                    <Text>Preguntasss</Text>
                </>
            )}
        </>

    )

}

export default Questions;