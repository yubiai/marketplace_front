import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import QuestionCardListSeller from "../../../../components/Cards/QuestionCardListSeller";
import Error from "../../../../components/Infos/Error";
import Paginations from "../../../../components/Layouts/Paginations";
import ProfileMenu from "../../../../components/Menus/ProfileMenu";
import Loading from "../../../../components/Spinners/Loading";
import useFetch from "../../../../hooks/data/useFetch";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider";

const QuestionsSeller = () => {

    const global = useGlobal()
    const router = useRouter()
    const dispatch = useDispatchGlobal()

    const { user, loggedOut } = useUser()

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch])

    const { data, isLoading, isError } = useFetch(
        global && global.profile && global.profile._id
            ? `/questions/seller/${global.profile._id}?page=${global.pageIndex}&size=4`
            : null,
        global?.profile?.token
    )

    if (isLoading || !data) return <Loading />

    if (isError) {
        return <Error error={isError?.message} />
    }

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Questions as seller </title>
            </Head>
            <ProfileMenu>
                <Container maxW="5xl" h={{base: "full", md: data.items && data.items.length > 0 ? "full": "80vh"}} display={'flex'} flexDirection={'column'}>
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
                            <Text>Seller</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="1em">Questions as seller</Heading>
                    <Box mt="1em">
                        {data && data.items && data.items.length > 0 && data.items.map((question, i) => {
                            return(
                                <span key={i}>
                                    <QuestionCardListSeller question={question} profile_id={global?.profile?._id} token={global?.profile?.token} />
                                </span>
                            )
                        })}
                    </Box>
                    <Paginations data={data ? data : null} />
                </Container>
            </ProfileMenu>
        </>

    )
}

export default QuestionsSeller;