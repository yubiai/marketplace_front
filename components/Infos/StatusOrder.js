import { Alert, AlertIcon, Text } from "@chakra-ui/react";

const StatusOrder = (status) => {

    if (status === 'ORDER_CREATED') {
        return (
            <Alert status="info" height={"35px"} borderRadius={"2px"}>
                <AlertIcon />
                <Text color="black" fontWeight={500}>Order created</Text>
            </Alert>
        )
    }

    if (status === 'ORDER_PAID') {
        return (
            <Alert status="success" height={"35px"} borderRadius={"2px"}>
                <AlertIcon />
                <Text color="black" fontWeight={500}>Order paid</Text>
            </Alert>
        )
    }

    if (status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING') {
        return (
            <Alert status='warning' height={"35px"} borderRadius={"2px"}>
                <AlertIcon />
                <Text color="black" fontWeight={500}>Dispute pending to start, waiting for seller to pay the
                    arbitration fee.</Text>
            </Alert>
        )
    }

    if (status === 'ORDER_DISPUTE_IN_PROGRESS') {
        return (
            <Alert status='info' height={"35px"} borderRadius={"2px"}>
                <AlertIcon />
                <Text color="black" fontWeight={500}>Dispute in progress.
                </Text>
            </Alert>
        )
    }

}

export default StatusOrder;