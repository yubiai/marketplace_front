import React from 'react';
import { Stack, Text, Flex, Divider, Box } from '@chakra-ui/react';
import { FaAngleDoubleRight } from 'react-icons/fa'
import moment from 'moment';

const QuestionCard = ({ question }) => {

    return (
        <>
            <Stack bg="white" p="2" boxShadow="lg" m="1" borderRadius="lg">
                <Text fontWeight="semibold">{question.question}</Text>
                {question.response && (
                    <>
                        <Divider />
                        <Flex h={"full"} width={"full"}>
                            <Box mt="2px">
                                <FaAngleDoubleRight />
                            </Box>
                            <Text ml="1em" fontSize={{ base: 'sm' }} maxW={'90%'}>
                                {question.response} - {moment(question.dateresponse).format('DD/MM/YY')
                                }
                            </Text>
                        </Flex>
                    </>
                )}
            </Stack>
        </>
    )
}

export default QuestionCard;