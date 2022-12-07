import React from 'react';
import { Stack, Text, Flex, Divider, Box } from '@chakra-ui/react';
import { FaAngleDoubleRight } from 'react-icons/fa'
import moment from 'moment';
import Link from 'next/link';
import ButtonNewAnswer from '../Buttons/ButtonNewAnswer';

const QuestionCardListSeller = ({ question, token }) => {

    return (
        <>
            <Stack bg="white" p="2" boxShadow="lg" m="2" borderRadius="lg">
                <Flex fontWeight={"semibold"} _hover={{
                    color: "blue.300"
                }}>
                    <Text mr="5px">Item:</Text>
                    <Link href={`/item/${question.itemId.slug}`}>{question.itemId.title}</Link>
                    <Text ml="1em">{question.itemId.price} {question.itemId.currencySymbolPrice}</Text>
                </Flex>
                <Divider />
                <Text fontWeight="medium">{question.question}</Text>
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