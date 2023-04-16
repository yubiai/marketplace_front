import { Badge, Box, Button, Center, Container, Divider, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { dealService } from '../../../services/dealService';
import { useEffect, useState } from "react";
import Head from "next/head";
import moment from "moment";
import ViewMsgText from "../../../components/Cards/ViewMsgText";
import ViewMsgFile from "../../../components/Cards/ViewMsgFile";
import FileIcon from "../../../components/Infos/FileIcon";
import Loading from "../../../components/Spinners/Loading";
import { StatusEvidence } from "../../../components/Infos/StatusEvidence";
import { parserForWei } from "../../../utils/orderUtils";
import ValidateSignatureEvidence from "../../../components/Modals/ValidateSignatureEvidence";

const EvidenceDetail = () => {

    const router = useRouter();
    const { claim_id } = router.query;
    const [evidence, setEvidence] = useState(null);

    const getEvidenceByClaimID = async () => {

        try {
            const response = await dealService.getEvidenceByClaimID(claim_id);
            if (response && response.status === 204) {
                return router.replace("/404")
            }
            setEvidence(response.data);
            return
        } catch (err) {
            console.error(err);
            return router.replace("/404")
        }
    }


    useEffect(() => {
        if (claim_id) {
            getEvidenceByClaimID()
            return
        }
    }, [claim_id])

    const goBack = () => {
        if (window.history.length > 2) {
            router.back();
          } else {
            router.push('/');
          }
        return
    }

    if (!evidence) return <Loading />

    console.log(router)
    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Evidence Detail </title>
                <meta
                    name="keywords"
                    content="yubiai, market, marketplace, crypto, eth, poh, metamask"
                />
            </Head>
            <Container
                maxW="6xl"
                h={'full'}
                display={'flex'}
                flexDirection={'column'}
            >
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
                            {moment(evidence && evidence?.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | # {evidence.transactionHash}
                        </Text>
                        <Stack mt="5px" direction='row'>
                            {StatusEvidence(evidence.status)}
                        </Stack>
                        <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Title</Text>
                        <Text>{evidence.title}</Text>
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Description</Text>
                        <Text>{evidence.description}</Text>
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Value To Claim</Text>
                        <Text>{parserForWei(evidence.value_to_claim)}</Text>
                        <Divider />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">PDF</Text>
                        <Link color="blue.700" href={process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_pdf} isExternal>{process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_pdf}</Link>
                        <Text fontWeight={600} fontSize="2xl" mt="1em">File Signature</Text>
                        <Text >{evidence.fileSignature}</Text>
                        <ValidateSignatureEvidence urlpdf={evidence.url_ipfs_pdf} fileSignature={evidence.fileSignature} evidence_id={evidence._id} />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">JSON</Text>
                        <Link color="blue.700" href={process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_json} isExternal>{process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_json}</Link>
                        <Divider />
                        <Text fontWeight={600} fontSize="2xl" mt="1em">Item</Text>
                        <Link href={"/item/" + evidence.order.itemId.slug} color="blue.700" fontWeight={"hairline"}>{evidence.order.itemId.title}</Link>
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
                        <Button bg="#00abd1" color="white" _hover={{ bg: "gray.200" }} m="2em" onClick={() => goBack()}>
                            Go Back
                        </Button>
                    </Box></Center>
            </Container>

        </>
    )
}

export default EvidenceDetail;