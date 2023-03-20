import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import BuyerFaqCard from '../../components/Cards/buyerFaqCard'
import SellerFaqCard from '../../components/Cards/sellerFaqCard'
import useTranslation from 'next-translate/useTranslation';

const Help = () => {
  const { t } = useTranslation("faq");
  return (
    <>
      <Head>
        <title>Yubiai a web3 marketplace - Help</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f8f8f8" />
        <meta name="description" content="Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform." />
        <meta name="keywords" content="Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees" />
        <meta name="author" content="Yubiai Members" />
        <meta property="og:title" content="Yubiai a web3 marketplace - Help" />
        <meta property="og:description" content="Marketplace" />
        <meta property="og:url" content="https://www.yubiai.com/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="Robots" content="all" />
      </Head>
      <Container
        maxW="6xl"
        h={'full'}
        display={'flex'}
        flexDirection={'column'}
        p={4}
      >
        <Heading mt="10px">{t("Help")}</Heading>
        <Text ml="2px" mt="10px" color="black">{t("subtitle")} <Link href="mailto:contact@yubiai.market"><Button padding="0px" bg="transparent" h="0px" color="#00abd1">contact@yubiai.market</Button></Link></Text>

        <Box
          padding={"1.5em"}
          borderRadius={"5px"}
          boxShadow={"0 4px 4px 0 rgba(0, 0, 0, 0.25)"}
          bg="white"
          color="black"
          mt="10px"
        >
          <Heading>
            <Text>{t("What is Yubiai?")}</Text>
          </Heading>
          <Text>
            {t("Yubiai is a decentralized marketplace that allows any people registered in proof of humanity to buy and sell everything using crypto")}
          </Text>
          <Heading mt="10px">
            <Text>{t("How do I use Yubiai?")}</Text>
          </Heading>
          <Text mt="5px" >
            {t("Answer use")}
          </Text>
          <Heading mt="10px">
            <Text >{t("How does Yubiai work?")}</Text>
          </Heading>
          <Text mt="5px" >
            {t("Answer explain")}
          </Text>
          <Heading mt="10px">
            <Text >{t("Invest")}</Text>
          </Heading>
          <Text mt="5px" >
            {t("Invest answer")}
          </Text>
          <Heading mt="10px">
            <Text >{t("How much you have raised so far?")}</Text>
          </Heading>
          <Text mt="5px" >
            {t("Answer raised")}
          </Text>
          <Heading mt="10px">
            <Text >{t("Are you incorporated?")}</Text>
          </Heading>
          <Text mt="5px" >
            {t("We are in process of being incorporated")}
          </Text>
          <Heading mt="10px">
            <Text >{t("I have a question that is not answered here")}</Text>
          </Heading>
          <Text mt="5px">
            {t("For any other questions, don't hesitate to contact us at")} <Link href="mailto:contact@yubiai.market" color="blue.400">contact@yubiai.market</Link>
          </Text>
          <Heading mt="10px">
            <Text>{t("Terms and Conditions")}</Text>
          </Heading>
          <Link href="/help/terms-and-conditions">
            <Button backgroundColor={'#00abd1'}
              color={'white'}
              rounded={'full'} mt="5px" _hover={{
                bg: "blue.300"
              }}>
              {t("See details")}
            </Button>
          </Link>
        </Box>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "24px", md: "24px" }}
          mt="10px"
          mb="2em"
        >
          <BuyerFaqCard />
          <SellerFaqCard />
        </Stack>
      </Container>
    </>
  )
}

export default Help
