import { Text } from "@chakra-ui/react";
import Link from "next/link";

const ButtonTermaConditions = () => {

    return (
        <Link mr={'1em'} href="/help/terms-and-conditions">
            <Text color="white" cursor={'pointer'} _hover={{
            textDecoration: "underline"
          }}>Terms and conditions</Text>
        </Link>
    )
}

export default ButtonTermaConditions;