import React from 'react';
import { Stack, Text, Flex, Divider, Box, Spacer, Image } from '@chakra-ui/react';
import { FaAngleDoubleRight } from 'react-icons/fa'
import moment from 'moment';
import Link from 'next/link';
import ButtonNewQuestion from '../Buttons/ButtonNewQuestion';
import ButtonNewReportQA from '../Buttons/ButtonNewReportQA';
import questionUtils from '../../utils/questionUtils';


const QuestionCardListBuyer = ({ question, profile_id, token, t }) => {
    

    return (
        <>
            <Stack bg="white" p="2" boxShadow="lg" m="2" borderRadius="lg">
                <Flex fontWeight={"semibold"} _hover={{
                    color: "blue.300"
                }}>
                    <Image
                        alt="Img Item"
                        m={{base:"1em", md: "0.8em"}}
                        border={"1px solid rgba(0,0,0,.1)"}
                        height={'50px'}
                        width={'50px'}
                        objectFit={'cover'}
                        src={question && question.itemId.files && question.itemId.files[0] ? process.env.NEXT_PUBLIC_LINK_FLEEK + question.itemId.files[0].filename : '/static/images/ybminilogo.png'}
                        fallbackSrc={question && question.itemId.files && question.itemId.files[0] ? process.env.NEXT_PUBLIC_LINK_GC + question.itemId.files[0].filename : '/static/images/ybminilogo.png'}
                    />
                    <Flex width="100%" mt={{base: "1em", md: "1.5em"}} noOfLines={3}>
                        <Link href={`/item/${question.itemId.slug}`}><Text
                            color={'gray.600'}
                            fontSize={'0.9em'}
                            _hover={{
                                color: "gray.400"
                              }}
                        >
                            {question.itemId.title}
                        </Text></Link>
                    </Flex>
                    <Text width="100%" ml="2em" mt={{base: "1em", md: "1.5em"}} noOfLines={3}>{question.itemId.price} {question.itemId.currencySymbolPrice}</Text>
                    <Spacer />
                    {question.status === 2 && (
                        <Text color={"blue.400"}>{questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status === 3 && (
                        <Text color={"orange.400"}>{questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status === 6 && (
                        <Text color={"red.400"}>{questionUtils.statusNumber(question.status)}</Text>
                    )}
                    {question.status !== 2 && question.status !== 3 && question.status !== 6 && (
                        <Text color={"orange.800"}>{questionUtils.statusNumber(question.status)}</Text>
                    )}
                </Flex>
                <Divider />
                <Text fontWeight="medium">{question.question}</Text>
                <Divider />
                <ButtonNewQuestion question={question} token={token} t={t}/>
                {question.answer && (
                    <>
                        <Divider />
                        <Flex h={"full"} width={"full"} p="1em" padding="5px" bg={"gray.200"}>
                            <Box mt="2px">
                                <FaAngleDoubleRight />
                            </Box>
                            <Text ml="1em" fontSize={{ base: 'sm' }} maxW={'90%'} noOfLines={3}>
                                {question.answer} - {moment(question.dateanswer).format('DD/MM/YY')}
                            </Text>
                            <ButtonNewReportQA reference={question._id} type={"Answer"} userId={profile_id} owner={false} token={token} t={t}/>
                        </Flex>
                    </>
                )}
            </Stack>
        </>
    )
}

export default QuestionCardListBuyer;