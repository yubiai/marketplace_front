import { Alert, AlertIcon, Text } from "@chakra-ui/react";

export const StatusOrder = (status) => {
    switch(status) {
        case "ORDER_CREATED":
            return (
                <Alert status="info" height={"35px"} borderRadius={"2px"} >
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Order created</Text>
                </Alert>
            );
        case "ORDER_PAID":
            return (
                <Alert status="success" height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Order paid</Text>
                </Alert>
            );
        case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
            return (
                <Alert status='warning' height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Dispute pending to start, waiting for seller to pay the
                        arbitration fee.</Text>
                </Alert>
            );
        case "ORDER_DISPUTE_IN_PROGRESS":
            return (
                <Alert status='info' height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Dispute in progress.
                    </Text>
                </Alert>
            );
        default:
            return <></>;
    }
}

export const StatusOrderByState = (stateId) => {
    switch(stateId) {
        case "1":
            return (
                <Alert status="info" height={"35px"} borderRadius={"2px"} >
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Order created</Text>
                </Alert>
            );
        case "2":
            return (
                <Alert status='warning' height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>The buyer has claimed a refund for this order. Please choice an option.</Text>
                </Alert>
            );
        case "3":
            return (
                <Alert status='info' height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Dispute in progress.</Text>
                </Alert>
            );
        case "4":
            return (
                <Alert status="success" height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>Order paid</Text>
                </Alert>
            );
        default:
            return <></>;
    }
}
