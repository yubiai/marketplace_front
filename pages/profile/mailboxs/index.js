import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileMenu from "../../../components/Menus/ProfileMenu";
import useTranslation from 'next-translate/useTranslation';

const MailBoxs = () => {
    const router = useRouter();
    const { t } = useTranslation("mailboxs");

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - MailBoxs </title>
            </Head>
            <ProfileMenu>
                <Container maxW="2xl" h="80vh" display={'flex'} flexDirection={'column'}>
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
                        <BreadcrumbItem isCurrentPage>
                            <Text>{"Mailboxs"}</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="1em">{"Mailboxs"}</Heading>
                    <Box mt="1em">
                        <Stack mt="1em" p="4" boxShadow="lg" borderRadius="lg" bg="white">
                            <Button h="100px" fontSize={"2em"} backgroundColor={'#00abd1'}
                                color={'white'} onClick={() => router.push("/profile/mailboxs/buyer")} _hover={{
                                    bg: "blue.300"
                                }}>{t("Buyer")}</Button>
                        </Stack>
                        <Stack mt="1em" p="4" boxShadow="lg" borderRadius="lg" bg="white">
                            <Button h="100px" fontSize={"2em"} backgroundColor={'#00abd1'}
                                color={'white'}  onClick={() => router.push("/profile/mailboxs/seller")} _hover={{
                                    bg: "blue.300"
                                }}>{t("Seller")}</Button>
                        </Stack>
                    </Box>
                </Container>
            </ProfileMenu>
        </>

    )
}

export default MailBoxs;