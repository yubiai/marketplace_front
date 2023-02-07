import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QuestionCardListBuyer from "../../../../components/Cards/QuestionCardListBuyer";
import Error from "../../../../components/Infos/Error";
import Paginations from "../../../../components/Layouts/Paginations";
import ProfileMenu from "../../../../components/Menus/ProfileMenu";
import Loading from "../../../../components/Spinners/Loading";
import useFetch from "../../../../hooks/data/useFetch";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider";
import { useTranslation } from "react-i18next";

const QuestionsBuyer = () => {

    const global = useGlobal()
    const router = useRouter()
    const dispatch = useDispatchGlobal()
    const [status, setStatus] = useState(2);
    const { t } = useTranslation("questions")
    const { user, loggedOut } = useUser()

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch])

    const { data, isLoading, isError, mutate } = useFetch(
        global && global.profile && global.profile._id
            ? `/questions/buyer/${global.profile._id}?page=${global.pageIndex}&size=4&status=${status}`
            : null,
        global?.profile?.token
    )

    if (isError) {
        return <Error error={isError?.message} />
    }

    if (isLoading || !data) return <Loading />


    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Questions as buyer </title>
            </Head>
            <ProfileMenu>
                <Container maxW="5xl" h={{ base: "full", md: data.items && data.items.length > 0 ? "full" : "80vh" }} display={'flex'} flexDirection={'column'}>
                    <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
                        <BreadcrumbItem>
                            <Link href="/" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>{t("Home")}</Text></Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <Link href="/profile" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>{t("Profile")}</Text></Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/profile/questions" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>{t("Questions")}</Text></Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <Text>{t("Buyer")}</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="1em">{t("Questions as buyer")}</Heading>
                    <Flex mt="1em">
                        <Button ml="1em" bg='green.400' color="white" size='sm' _focus={{
                            bg: 'green.700'
                        }} _hover={{ bg: 'green.200' }}
                            isDisabled={status === 2}
                            onClick={() => {
                                setStatus(2)
                                mutate()
                            }}>Published</Button>
                        <Button ml="1em" bg='green.400' color="white" size='sm' _focus={{
                            bg: 'green.700'
                        }} _hover={{ bg: 'green.200' }} isDisabled={status === 3}
                            onClick={() => {
                                setStatus(3)
                                mutate()
                            }}>Unpublished</Button>
                    </Flex>
                    <Box mt="1em">
                        {data && data.items && data.items.length > 0 && data.items.map((question, i) => {
                            return (
                                <span key={i}>
                                    <QuestionCardListBuyer question={question} profile_id={global?.profile?._id} token={global?.profile?.token} />
                                </span>
                            )
                        })}
                        {data && data.items && data.items.length === 0 && (
                            <Text fontSize={"2xl"}>{t("There is no questions.")}</Text>
                        )}
                    </Box>
                    <Paginations data={data ? data : null} />
                </Container>
            </ProfileMenu>
        </>

    )
}

export default QuestionsBuyer;