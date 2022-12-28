import { Box, Text } from "@chakra-ui/react";

export const NONE_STATUS = "0";
export const ONGOING_STATUS = "1";
export const CLAIMED_STATUS = "2";
export const DISPUTED_STATUS = "3";
export const FINISHED_STATUS = "4";

export const CLAIM_RESULT_REJECTED = "0";
export const CLAIM_RESULT_ACCEPTED = "1";

export const StatusOrder = (status) => {
    switch (status) {
        case "ORDER_CREATED":
            return (
                <Box bg="blue.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order created</Text>
                </Box>
            );
        case "ORDER_PAID":
            return (
                <Box bg="green.400" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order paid</Text>
                </Box>
            );
        case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
            return (
                <Box bg="purple.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Dispute pending to start, waiting for seller to pay the
                        arbitration fee.</Text>
                </Box>
            );
        case "ORDER_DISPUTE_IN_PROGRESS":
            return (
                <Box bg="purple.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Dispute in progress.</Text>
                </Box>
            );
        default:
            return <></>;
    }
}

export const StatusOrderByState = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '') => {
    switch (dealStatus) {
        case "1":
            return (
                <Box bg="blue.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order created</Text>
                </Box>
            );
        case "2":
            return (
                <Box bg="pink.300" rounded={'full'} w="100%">
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">The buyer has claimed a refund for this order. Please choose an option.</Text>
                </Box>
            );
        case "3":
            return (
                <Box bg="purple.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Dispute in progress.</Text>
                </Box>
            );
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                const claimLimitReaches = claimCount === claimLimit;
                return (
                    <Box bg="purple.300" rounded={'full'}>
                        <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Claim rejected. {
                            claimLimitReaches
                                ? 'You reaches the limit of claims you can do to the seller.'
                                : `You have ${claimLimit - claimCount} opportunities to try a new claim.`
                        }</Text>
                    </Box>
                );
            }
            return (
                <Box bg="green.400" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order paid</Text>
                </Box>
            );
        default:
            return <></>;
    }
}

export const StatusOrderByStateShort = (dealStatus, claimResult, claimCount = 0, disputeId = '') => {
    switch (dealStatus) {
        case "1":
            return (
                <Box bg="blue.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order created</Text>
                </Box>
            );
        case "2":
            return (
                <Box bg="pink.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order claimed</Text>
                </Box>
            );
        case "3":
            return (
                <Box bg="purple.300" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">In dispute</Text>
                </Box>
            );
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                return (
                    <Box bg="red.400" rounded={'full'}>
                        <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Claim rejected</Text>
                    </Box>
                );
            }
            return (
                <Box bg="green.400" rounded={'full'}>
                    <Text color="black" fontWeight={"semibold"} fontStyle="italic" pl="15px" pr="15px">Order paid</Text>
                </Box>
            );
        default:
            return <></>;
    }
}

export const statusDescMap = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '') => {
    switch (dealStatus) {
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