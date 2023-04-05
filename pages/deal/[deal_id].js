import { Spinner, Center, Box } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dealService } from "../../services/dealService";
import Head from "next/head";

const DealInfo = () => {

    const router = useRouter();
    const { deal_id } = router.query;

    const getItemSlugByDealId = async () => {
        await dealService.getItemSlugByDealId(deal_id).then((res) => {
            console.log(res.data)
            if (res.status == 200 && res.data && res.data.slug) {
                router.replace("/item/" + res.data.slug)
                return
            }
            return router.replace("/404")
        })
        .catch((err) => {
            console.error(err);
            return
        })
        return
    }

    useEffect(() => {
        if (deal_id) {
            getItemSlugByDealId()
            return
        }
    }, [deal_id])

    return (
        <>
            <Head>
                <title>{`Yubiai a web3 marketplace - Deal ${deal_id}`}</title>
            </Head>
            <Box h="90vh">
                <Center>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        m="2em"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="md"
                    />
                </Center>
            </Box>
        </>
    )
}

export default DealInfo;