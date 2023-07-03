import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import SEO from '../../components/Utils/SEO'
import Link from 'next/link'
import BuyerFaqCard from '../../components/Cards/buyerFaqCard'
import SellerFaqCard from '../../components/Cards/sellerFaqCard'
import useTranslation from 'next-translate/useTranslation';

const Help = () => {
  const { t } = useTranslation("faq");
  return (
    <>
      <SEO
        title={"Help"}
        description={"Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform."}
        keywords={"Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"}
        imageUrl={"/apple-touch-icon.png"}
      />
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
            {t("Yubiai is")}
          </Text>
          <Heading mt="10px">
            <Text>{t("How do I use Yubiai?")}</Text>
          </Heading>
          <Text mt="5px">
            {t("Answer use0")}
          </Text>
          <Text mt="3px">
            {t("Answer use1")}
          </Text>
          <Text mt="3px">
            {t("Answer use2")} <Link href="https://app.yubiai.market">https://app.yubiai.market</Link>
          </Text>
          <Text mt="3px">
            {t("Answer use3")}
          </Text>
          <Text mt="3px">
            {t("Answer use4")}
          </Text>
          <Text mt="3px">
            {t("Answer use5")}
          </Text>

          <Heading mt="10px">
            <Text >{t("How does Yubiai work?")}</Text>
          </Heading>
          <Text mt="5px" noOfLines={3}>
            {t("Answer explain0")}
          </Text>
          <Text mt="3px">
            {t("Answer explain1")}
          </Text>
          <Text mt="3px">
            {t("Answer explain2")}
          </Text>
          <Text mt="3px">
            {t("Answer explain3")}
          </Text>
          <Text mt="3px">
            {t("Answer explain4")}
          </Text>
          <Text mt="3px">
            {t("Answer explain5")}
          </Text>
          <Text mt="3px">
            {t("Answer explain6")}
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
