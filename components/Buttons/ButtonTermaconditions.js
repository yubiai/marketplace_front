import { Text } from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from 'next-translate/useTranslation';

const ButtonTermaConditions = () => {
    const { t } = useTranslation("footer");

    return (
        <Link mr={'1em'} href="/help/terms-and-conditions">
            <Text color="white" cursor={'pointer'} _hover={{
            textDecoration: "underline"
          }}>{t("Terms and conditions")}</Text>
        </Link>
    )
}

export default ButtonTermaConditions;