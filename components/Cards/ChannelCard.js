import { Box, Button, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";


const ChannelCard = ({ channel, mood }) => {
    const router = useRouter();

    return (
        <>
            <Card mt="1em">
                <CardBody>
                    <Flex justifyContent={"space-between"}>
                        <Box>
                            <Text>Fecha: {moment(channel.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                            {channel && channel.seller && channel.seller.name && (
                                <Text>Vendedor: {channel.seller.name} </Text>
                            )}
                            {channel && channel.buyer && channel.buyer.name && (
                                <Text>Comprador: {channel.buyer.name}</Text>
                            )}
                        </Box>
                        <Box>
                            <Button color="blue.300" m="5px" onClick={() => router.push("/profile/mailboxs/id/" + channel._id)}>Channel</Button>
                            {channel && channel.order_id && channel.order_id.transactionHash && mood === "seller" && (
                                <Button color="red.200" m="5px" onClick={() => router.push("/profile/orders/as-seller/" + channel.order_id.transactionHash)}>Order</Button>
                            )}
                            {channel && channel.order_id && channel.order_id.transactionHash && mood === "buyer" && (
                                <Button color="red.200" m="5px" onClick={() => router.push("/profile/orders/detail/" + channel.order_id.transactionHash)}>Order</Button>
                            )}
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </>
    )
}

export default ChannelCard;