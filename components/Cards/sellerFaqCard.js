import { Box, Center, Heading, Text } from "@chakra-ui/react";
import useTranslation from 'next-translate/useTranslation';

const SellerFaqCard = () => {
  const { t } = useTranslation("faq");
  return (
    <Box
      width={{ base: "100%", md: "50%" }}
      position={"relative"}
      height={{ base: "660px", md: "400px" }}
      padding={"1.5em"}
      borderRadius={"5px"}
      boxShadow={"0 4px 4px 0 rgba(0, 0, 0, 0.25)"}
      bg="white"
      color="black"
    >
      <Center>
        <Heading fontSize={"3xl"}>
          <Text as="u">{t("Seller")}</Text>
        </Heading>
      </Center>
      <Heading fontSize={"2xl"} mt="1em">
        <Text>{t("How do I start selling?")}</Text>
      </Heading>
      <Text>
        {t("Start by clicking on “Connect” on the top right corner then below the search bar on the middle of the navigation area(top middle)click on “Sell” and follow through the steps from Category to Product Images then after filling each field click on “Preview & Submit for review” verify that all is correct and click on `Submit for review`")}
      </Text>
      <Heading fontSize={"2xl"} mt="1em">
        <Text>{t("What is `UBI Burning Amount`?")}</Text>
      </Heading>
      <Text>
        {t("UBI Burning Amount lets you choose on a dinamyc and optional way how much % will be deducted and sent from the total price of the item you are selling to the UBI Burner to increase the value of $UBI.")}
      </Text>
    </Box>
  );
};

export default SellerFaqCard;
