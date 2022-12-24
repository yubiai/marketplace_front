import React from 'react';
import { Stack, Text, Flex, Divider, Box } from '@chakra-ui/react';
import { FaAngleDoubleRight } from 'react-icons/fa'
import moment from 'moment';
import ButtonNewReportQA from '../Buttons/ButtonNewReportQA';

const QuestionCard = ({ question, profile_id, token }) => {

    return (
        <>
            <Stack bg="white" p="2" boxShadow="lg" m="1" borderRadius="lg">
                <Flex>
                    <Text as='cite' noOfLines={3}>{question.question}</Text>
                    <ButtonNewReportQA reference={question._id} type={"Question"} userId={profile_id} owner={profile_id == question.buyer._id} token={token} />
                </Flex>
                {question.answer && (
                    <>
                        <Divider />
                        <Flex h={"full"}>
                            <Box mt="2px">
                                <FaAngleDoubleRight />
                            </Box>
                            <Text ml="1em" fontSize={{ base: 'sm' }} maxW={'90%'} padding="5px" bg={"gray.200"} noOfLines={3}>
                                {question.answer} - {moment(question.dateresponse).format('DD/MM/YY')}
                            </Text>
                            <ButtonNewReportQA reference={question._id} type={"Answer"} userId={profile_id} owner={profile_id == question.seller._id} token={token} />
                        </Flex>
                    </>
                )}
            </Stack>
        </>
    )
}

export default QuestionCard;