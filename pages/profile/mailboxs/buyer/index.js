import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider";
import useFetch from "../../../../hooks/data/useFetch";
import Loading from "../../../../components/Spinners/Loading";
import ChannelCard from "../../../../components/Cards/ChannelCard";
import Paginations from "../../../../components/Layouts/Paginations";
import Error from "../../../../components/Infos/Error";

const MailBoxsBuyer = () => {
    const global = useGlobal()
    const dispatch = useDispatchGlobal()
    const { t } = useTranslation("orders");
    const router = useRouter()
    const { user, loggedOut } = useUser()

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch])

    console.log(user, "user")

    const {
        data: channels,
        isLoading,
        isError,
    } = useFetch(
        global && global.profile && global.profile.token && user && user.id
            ? `/channel/channels/buyer/${user.id}?page=${global.pageIndex}&size=10`
            : null,
        global && global.profile && global.profile.token
    )

    console.log(channels, "channels")

    if (isError) {
        return <Error error={isError?.message} />
    }

    if (isLoading || !channels || !user) return <Loading />

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Mailbox</title>
            </Head>

            <Container
                maxW="5xl"
                display={'flex'}
                flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
                h={{ base: 'full', md: 'full' }}
            >
                <Box w={{ base: 'full', lg: '70%' }}>
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
                            <Link href="/profile/mailboxs" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>{"Mailboxs"}</Text></Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Text>Buyer</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="10px" fontSize={'3xl'} fontFamily={'body'}>
                        Channels as a buyer
                    </Heading>
                    <Box mt="2em">
                        {channels && channels.items.length > 0 && channels.items && channels.items.map((channel, i) =>
                            (
                                <ChannelCard key={i} channel={channel} />
                            )
                        )}
                        <Paginations data={channels ? channels : null} />
                    </Box>
                </Box>

            </Container>
        </>

    )
}

export default MailBoxsBuyer;