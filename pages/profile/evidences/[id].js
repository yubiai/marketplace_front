import { Badge, Box, Breadcrumb, BreadcrumbItem, Button, Center, Container, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { evidenceService } from "../../../services/evidenceService";
import { useDispatchGlobal, useGlobal } from "../../../providers/globalProvider"
import { useState } from "react";
import useUser from "../../../hooks/data/useUser";
import Loading from "../../../components/Spinners/Loading";
import FileIcon from "../../../components/Infos/FileIcon";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import ViewMsgText from "../../../components/Cards/ViewMsgText";
import ViewMsgFile from "../../../components/Cards/ViewMsgFile";


const EvidenceDetail = () => {

    const global = useGlobal();
    const dispatch = useDispatchGlobal();
    const router = useRouter();
    const { id } = router.query;
    const [evidence, setEvidence] = useState(null)

    const { user, loggedOut } = useUser();

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch]);

    const loadEvidence = async () => {

        try {
            const response = await evidenceService.getEvidenceById(id, global.profile.token);
            setEvidence(response.data)

        } catch (err) {
            console.error(err);
            setEvidence(null)
        }
    }

    useEffect(() => {
        if (global && global.profile) {
            loadEvidence()
        }
    }, [global && global.profile])

    if (!user || !evidence) return <Loading />

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Evidence Detail </title>
                <meta
                    name="keywords"
                    content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
                />
            </Head>
            <Container
                maxW="6xl"
                h={'full'}
                display={'flex'}
                flexDirection={'column'}
            >
                <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem>
                        <Link href="/" cursor={'pointer'} _hover={{
                            textDecoration: "underline"
                        }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                            textDecoration: "underline"
                        }}>Home</Text></Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link href={`/profile/orders/detail/${evidence.transactionHash}`}><Text color="#00abd1" cursor={'pointer'} _hover={{
                            textDecoration: "underline"
                        }}>Order detail</Text></Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Text>Evidence</Text>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Center py={6}>
                    <Box
                        w={"80%"}
                        bg={'white'}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        p={6}
                    >
                        <Heading fontSize={'3xl'} fontFamily={'body'}>
                            Evidence Detail
                        </Heading>
                        <Text fontWeight={600} fontSize={'0.8em'} color={'gray.500'} mt="5px">
                            {moment(evidence && evidence?.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | # {evidence?._id}
                        </Text>
                        <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                        Status: {evidence.status}
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Title</Text>
                        <Text>{evidence.title}</Text>
                        <Divider />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Description</Text>
                        <Text>{evidence.description}</Text>
                        <Divider />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">TransactionHash</Text>
                        <Text>{evidence.transactionHash}</Text>
                        <Divider />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Order ID</Text>
                        <Text>{evidence.order_id}</Text>
                        <Divider />
                        {evidence.messages && evidence.messages.length > 0 && (
                            <>
                                <Divider />
                                <Text fontWeight={600} fontSize="2xl" mt="1em">Messages</Text>
                            </>
                        )}

                        {evidence.messages.length > 0 && evidence.messages.map((msg, i) => {
                            return (
                                <Flex key={i}>
                                    {msg.text && (
                                        ViewMsgText(msg)
                                    )}
                                    {msg.file && (
                                        ViewMsgFile(msg)
                                    )}
                                </Flex>
                            )
                        })}

                        {evidence.files && evidence.files.length > 0 && (
                            <>
                                <Divider />
                                <Text fontWeight={600} fontSize="2xl" mt="1em">Files</Text>
                            </>
                        )}

                        {evidence.files.length > 0 && evidence.files.map((file, i) => {
                            return (
                                <Link key={i}
                                    href={process.env.NEXT_PUBLIC_LINK_FLEEK + "evidences/" + file.filename} >
                                    <Stack
                                        mt="1em"
                                        direction={{ base: 'column', md: 'row' }}
                                        justifyContent="left"
                                        cursor="pointer"
                                        _hover={{
                                            bg: "gray.300"
                                        }}>
                                        <Flex>
                                            <Box w="35px">
                                                <FileIcon type={file?.mimetype} />
                                            </Box>
                                            <Box ml='3'>
                                                <Text fontWeight='bold' fontSize={{ base: 'sm', md: 'sm' }}>
                                                    {file?.filename}
                                                    <Badge ml='1' colorScheme='green'>
                                                        {evidence.author.first_name} {evidence.author.last_name}
                                                    </Badge>
                                                </Text>
                                                <Text fontSize='sm'>{moment(file?.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                                            </Box>
                                        </Flex>
                                    </Stack>
                                </Link>
                            )
                        })}

                        <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
              Go Back
            </Button>
                    </Box>
                </Center>
            </Container>
        </>
    )

}

export default EvidenceDetail;