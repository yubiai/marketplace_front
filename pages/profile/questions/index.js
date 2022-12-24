import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileMenu from "../../../components/Menus/ProfileMenu";

const Questions = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Edit My Profile </title>
            </Head>
            <ProfileMenu>
                <Container maxW="2xl" h="80vh" display={'flex'} flexDirection={'column'}>
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
                        <BreadcrumbItem isCurrentPage>
                            <Text>Questions</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading mt="1em">Questions</Heading>
                    <Box mt="1em">
                        <Stack mt="1em" p="4" boxShadow="lg" borderRadius="lg" bg="white">
                            <Button h="100px" fontSize={"2em"} backgroundColor={'#00abd1'}
                                color={'white'} onClick={() => router.push("/profile/questions/buyer")} _hover={{
                                    bg: "blue.300"
                                }}>Buyer</Button>
                        </Stack>
                        <Stack mt="1em" p="4" boxShadow="lg" borderRadius="lg" bg="white">
                            <Button h="100px" fontSize={"2em"} backgroundColor={'#00abd1'}
                                color={'white'}  onClick={() => router.push("/profile/questions/seller")} _hover={{
                                    bg: "blue.300"
                                }}>Seller</Button>
                        </Stack>
                    </Box>
                </Container>
            </ProfileMenu>
        </>

    )
}

export default Questions;