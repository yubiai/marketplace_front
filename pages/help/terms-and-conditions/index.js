import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import axios from 'axios'
import moment from 'moment'

const TermsAndConditions = ({ terms }) => {

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Terms and Conditions</title>
            </Head>
            <Container
                maxW="6xl"
                h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
                display={'flex'}
                flexDirection={'column'}
                p={4}
            >
                <Box h="100vh" w="full">
                    <Heading mt="1em">Terms and Conditions</Heading>
                    <Box
                    >
                        <Text m="1em" fontWeight={600}>Last revision: {moment(terms.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        <Text m="1em">
                            {terms.text}
                        </Text>
                    </Box>
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