import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Container, Divider, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import ButtonNewAnswer from "../../../../components/Buttons/ButtonNewAnswer";
import ButtonNewQuestion from "../../../../components/Buttons/ButtonNewQuestion";
import ProfileMenu from "../../../../components/Menus/ProfileMenu";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider";
import { questionService } from "../../../../services/questionService";

const QuestionById = () => {
    const global = useGlobal();
    const dispatch = useDispatchGlobal();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const { question_id } = router.query;
    const [question, setQuestion] = useState(null);
    const [isBuyer, setIsBuyer] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    const { user, loggedOut } = useUser()

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch])

    const verifyUser = (resQuestion) => {

        if (global.profile._id === resQuestion.buyer) {
            setIsBuyer(true)
            setQuestion(resQuestion)
            setLoading(false)
            return
        }

        if (global.profile._id === resQuestion.seller) {
            setIsSeller(true)
            setQuestion(resQuestion)
            setLoading(false)
            return
        }

        if (global.profile._id === resQuestion.buyer || global.profile._id === resQuestion.seller) {
            return
        } else {
            router.push("/logout");
            return
        }

    }

    const getQuestion = async () => {
        if (question_id && global.profile && global.profile.token) {
            setLoading(true)
            const result = await questionService.getQuestionById(question_id, global.profile.token)
            const resQuestion = result && result.data ? result.data : null;
            if (resQuestion) {
                verifyUser(resQuestion)
            }
            return
        }
        return
    }

    useEffect(() => {
        setLoading(false)
        getQuestion()
        return
    }, [question_id, global.profile, router]);

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Question </title>
            </Head>
            <ProfileMenu>
                <Container maxW="5xl" h={{ base: "80vh", md: "80vh" }} display={'flex'} flexDirection={'column'}>
                    <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
                        <BreadcrumbItem>
                            <Link href="/" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>Home</Text></Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <Link href="/profile" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>Profile</Text></Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/profile/questions" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>Questions</Text></Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <Text># {question_id}</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="1em">Question</Heading>
                    {loading && (
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="md"
                        />
                    )}
                    {!loading && question && (
                        <Box mt="1em">
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
                                {question.answer && (
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
                                )}
                            </Stack>
                        </Box>
                    )}
                    {isBuyer && question && (
                        <Stack bg="white" p="2" boxShadow="lg" m="2" borderRadius="lg">
                            <ButtonNewQuestion question={question} token={global?.profile?.token} />
                        </Stack>
                    )}
                    {isSeller && question && !question.answer && (
                        <ButtonNewAnswer question={question} token={global?.profile?.token} />
                    )}
                </Container>
            </ProfileMenu>
        </>
    )
}

export default QuestionById;