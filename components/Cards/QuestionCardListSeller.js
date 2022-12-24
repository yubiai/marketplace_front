import React from 'react';
import { Stack, Text, Flex, Divider, Box, Spacer } from '@chakra-ui/react';
import { FaAngleDoubleRight } from 'react-icons/fa'
import moment from 'moment';
import Link from 'next/link';
import ButtonNewAnswer from '../Buttons/ButtonNewAnswer';
import ButtonNewReportQA from '../Buttons/ButtonNewReportQA';
import questionUtils from '../../utils/questionUtils';

const QuestionCardListSeller = ({ question, profile_id, token }) => {

    return (
        <>
            <Stack bg="white" p="2" boxShadow="lg" m="2" borderRadius="lg">
                <Flex fontWeight={"semibold"} _hover={{
                    color: "blue.300"
                }}>
                    <Text mr="5px">Item:</Text>
                    <Link href={`/item/${question.itemId.slug}`}>{question.itemId.title}</Link>
                    <Text ml="1em">{question.itemId.price} {question.itemId.currencySymbolPrice}</Text>
                    <Spacer />
                    {question.status === 2 && (
                        <Text color={"blue.400"}>Status: {questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status === 3 && (
                        <Text color={"orange.400"}>Status: {questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status === 6 && (
                        <Text color={"red.400"}>Status: {questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status !== 2 && question.status !== 3 && question.status !== 6 && (
                        <Text color={"orange.800"}>Status: {questionUtils.statusNumber(question.status)}</Text>
                    )}
                </Flex>
                <Divider />
                <Flex>
                    <Text fontWeight="medium">{question.question}</Text>
                    <ButtonNewReportQA reference={question._id} type={"Question"} userId={profile_id} owner={false} token={token} />
                </Flex>
                <Divider />
                {question.answer ? (
                    <>
                        <Divider />
                        <Flex h={"full"} width={"full"} p="1em" bg={"gray.200"}>
                            <Box mt="2px">
                                <FaAngleDoubleRight />
                            </Box>
                            <Text ml="1em" fontSize={{ base: 'sm' }} maxW={'90%'}>
                                {question.answer} - {moment(question.dateanswer).format('DD/MM/YY')}
                            </Text>
                        </Flex>
                    </>
                ) : (
                    <>
                        <ButtonNewAnswer question={question} token={token} />
                    </>
                )}
            </Stack>
        </>
    )
}

export default QuestionCardListSeller;