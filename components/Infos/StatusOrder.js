import { Alert, AlertIcon, Text } from "@chakra-ui/react";

export const NONE_STATUS = "0";
export const ONGOING_STATUS = "1";
export const CLAIMED_STATUS = "2";
export const DISPUTED_STATUS = "3";
export const FINISHED_STATUS = "4";

export const CLAIM_RESULT_REJECTED = "0";
export const CLAIM_RESULT_ACCEPTED = "1";

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

export const StatusOrderByState = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '') => {
    switch(dealStatus) {
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
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                const claimLimitReaches = claimCount === claimLimit;
                return (
                    <Alert status="error" height={"35px"} borderRadius={"2px"}>
                        <AlertIcon />
                        <Text color="black" fontWeight={500}>
                            Claim rejected. {
                                claimLimitReaches
                                ? 'You reaches the limit of claims you can do to the seller.'
                                : `You have ${claimLimit - claimCount} opportunities to try a new claim.`
                            }
                        </Text>
                    </Alert>
                );
            }
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

export const StatusOrderByStateShort = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '') => {
    switch(dealStatus) {
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
                    <Text color="black" fontWeight={500}>Order claimed</Text>
                </Alert>
            );
        case "3":
            return (
                <Alert status='info' height={"35px"} borderRadius={"2px"}>
                    <AlertIcon />
                    <Text color="black" fontWeight={500}>In dispute</Text>
                </Alert>
            );
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                return (
                    <Alert status="error" height={"35px"} borderRadius={"2px"}>
                        <AlertIcon />
                        <Text color="black" fontWeight={500}>
                            Claim rejected
                        </Text>
                    </Alert>
                );
            }
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

export const statusDescMap = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '') => {
    switch(dealStatus) {
        case "1":
            return "ORDER_CREATED";
        case "2":
            return "ORDER_DISPUTE_RECEIVER_FEE_PENDING";
        case "3":
            return "ORDER_DISPUTE_IN_PROGRESS";
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                const claimLimitReaches = claimCount === claimLimit;
                if (claimLimitReaches) {
                    return "CLAIM_REJECTED_LIMIT_REACHED";
                }
                return "CLAIM_REJECTED";
            }
            return "ORDER_PAID";
        default:
            return "UNKNOWN_STATE";
    }
}