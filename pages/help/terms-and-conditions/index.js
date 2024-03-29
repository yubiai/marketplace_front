import { Box, Container, Heading, Text } from "@chakra-ui/react";
import SEO from '../../../components/Utils/SEO'
import axios from 'axios'
import moment from 'moment'
import RichTextReadOnly from "../../../components/Utils/richTextReadOnly";
import Error from '../../../components/Infos/Error'

const TermsAndConditions = ({ terms }) => {

    if (!terms) return <Error error={"Error getting term."} />

    return (
        <>
            <SEO
                title={"Terms and Conditions"}
                description={"Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform."}
                keywords={"Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"}
                imageUrl={"/apple-touch-icon.png"}
            />
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