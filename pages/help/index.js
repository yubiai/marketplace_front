import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import BuyerFaqCard from '../../components/Cards/buyerFaqCard'
import SellerFaqCard from '../../components/Cards/sellerFaqCard'

const Help = () => {
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Help</title>
      </Head>
      <Container
        maxW="6xl"
        h={'full'}
        display={'flex'}
        flexDirection={'column'}
        p={4}
      >
        <Heading mt="1em">Help</Heading>
        <Box
          padding={"1.5em"}
          borderRadius={"5px"}
          boxShadow={"0 4px 4px 0 rgba(0, 0, 0, 0.25)"}
          bg="white"
          color="black"
          mt="1em"
        >
          <Heading>
            <Text>What is Yubiai?</Text>
          </Heading>
          <Text mt="5px">
            Yubiai is a decentralized marketplace that allows any people
            registered in proof of humanity to buy and sell everything using
            crypto.
          </Text>
          <Heading mt="10px">
            <Text>How do I use Yubiai?</Text>
          </Heading>
          <Text mt="5px" >
            If you are already registered in Proof Of Humanity you can connect
            with your wallet from PoH on app.yubiai.market and start using the
            platform, if not just go ahead to https://app.proofofhumanity.id/,
            create a new metamask wallet and register.
          </Text>
          <Heading mt="10px">
            <Text >How does Yubiai work?</Text>
          </Heading>
          <Text mt="5px" >
            Yubiai has three layers of security, one is proofofhumanity as
            identity and authentication method, the other ones are Kleros
            Escrow, dispute resolution and curate. PoH acts a sybil resistance
            mechanism so you know that you are transactioning with a real human,
            the kleros escrow holds the payment of every transaction and if
            anything goes well it releases the payment to the seller or if
            anything goes sideways the dispute resolver kicks in and a juror
            will decide upon evidence how to rule. And there is the last
            mechanism that is curate, in every submission of an item, if it’s
            inside the scope or regulations of each country and specifications
            of submission your item will be published if not it will get
            rejected.
          </Text>
          <Heading mt="10px">
            <Text>Terms and Conditions</Text>
          </Heading>
          <Link href="/help/terms-and-conditions">
            <Button backgroundColor={'#00abd1'}
              color={'white'}
              rounded={'full'} mt="5px">
              See details
            </Button>
          </Link>
        </Box>
        <Stack
          direction={["column", "row"]}
          spacing={{ base: "24px", md: "24px" }}
          mt="1em"
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
