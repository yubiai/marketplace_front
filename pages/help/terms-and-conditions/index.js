import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import axios from 'axios'
import moment from 'moment'
import RichTextReadOnly from "../../../components/Utils/richTextReadOnly";
import Loading from "../../../components/Spinners/Loading";

const TermsAndConditions = ({ terms }) => {

    if(!terms) return (
        <Loading />
    )

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Terms and Conditions</title>
            </Head>
            <Head>
                <title>Yubiai Marketplace - Help</title>
            </Head>
            <Container
                maxW="6xl"
                h={terms && terms.text ? 'full' : "100vh"}
                display={'flex'}
                flexDirection={'column'}
                p={4}
            >
                <Heading mt="1em">Terms and Conditions</Heading>
                <Box
                    padding={"1.5em"}
                    borderRadius={"5px"}
                    boxShadow={"0 4px 4px 0 rgba(0, 0, 0, 0.25)"}
                    bg="white"
                    color="black"
                    mt="1em"
                >
                    {terms && terms.text && (
                        <>
                            <Text mb="1em" fontWeight={600}>Last revision: {moment(terms.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                            <RichTextReadOnly text={terms && terms.text} />
                        </>
                    )}
                </Box>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    try {
        const res = await axios.get('/terms/')
        const terms = res.data;
        if (!terms) {
            return { notFound: true };
        }
        return { props: { terms }, revalidate: 1800 }
    } catch (err) {
        console.log(err)
        return { notFound: true };
    }
}

export default TermsAndConditions;