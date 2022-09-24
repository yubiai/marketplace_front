import { Box, Button, Center, Container, Divider, Heading, Text } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { evidenceService } from "../../../services/evidenceService";
import { useDispatchGlobal, useGlobal } from "../../../providers/globalProvider"
import { useState } from "react";
import useUser from "../../../hooks/data/useUser";
import Loading from "../../../components/Spinners/Loading";


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
                h={{base: 'full', md: '80vh'}}
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
                            {moment(evidence && evidence?.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | # {evidence?._id}
                        </Text>
                        <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
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
                        <Button onClick={() => router.back()} color="white" bg="green" mt="4em">Back</Button>
                    </Box>
                </Center>
            </Container>
        </>
    )

}

export default EvidenceDetail;