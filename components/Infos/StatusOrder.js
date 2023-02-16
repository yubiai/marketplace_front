import { Box, Text } from "@chakra-ui/react";




export const NONE_STATUS = "0";
export const ONGOING_STATUS = "1";
export const CLAIMED_STATUS = "2";
export const DISPUTED_STATUS = "3";
export const FINISHED_STATUS = "4";

export const CLAIM_RESULT_REJECTED = "0";
export const CLAIM_RESULT_ACCEPTED = "1";

export const StatusOrder = ({status, t}) => {
    
    switch (status) {
        case "ORDER_CREATED":
            return (
                <Box bg="blue.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="black" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order created")}</Text>
                </Box>
            );
        case "ORDER_PAID":
            return (
                <Box bg="green.400" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="black" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order paid")}</Text>
                </Box>
            );
        case "ORDER_REFUNDED":
            return (
                <Box bg="red.700" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order refunded")}</Text>
                </Box>
            );
        case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
            return (
                <Box bg="purple.300" rounded={"5px"} p="5px" w={{ base: "100%", md: "max-content" }}>
                    <Text color="black" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Dispute pending to start, waiting for seller to pay the arbitration fee.")}</Text>
                </Box>
            );
        case "ORDER_DISPUTE_IN_PROGRESS":
            return (
                <Box bg="purple.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Dispute in progress")}</Text>
                </Box>
            );
        default:
            return <></>;
    }
}

export const StatusOrderByState = (dealStatus, claimResult, claimCount = 0, claimLimit = 0, disputeId = '', t) => {
    console.log('t:', t)
    
    switch (dealStatus) {
        case "1":
            return (
                <Box bg="blue.500" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order created")}</Text>
                </Box>
            );
        case "2":
            return (
                <Box bg="pink.300" rounded={"5px"} p="5px" w={{ base: "100%", md: "max-content" }}>
                    <Text fontSize={"larger"} fontStyle="normal" color="black" pl="15px" pr="15px">{t("The buyer has claimed a refund for this order")}</Text>
{/*                     <Text color="black" fontStyle="italic" pl="15px" pr="15px">Please choose an option.</Text>
 */}                </Box>
            );
        case "3":
            return (
                <Box bg="purple.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Dispute in progress")}</Text>
                </Box>
            );
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                const claimLimitReaches = claimCount === claimLimit;
                return (
                    <Box bg="purple.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                        <Text color="black" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim rejected")} {
                            claimLimitReaches
                                ? t("You reached the limit of claims you can do to the seller")
                                : ` ${t("Opportunities to try a new claim")}  ${claimLimit - claimCount}`
                        }</Text>
                    </Box>
                );
            }
            return (
                <Box bg="green.400" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order paid")}</Text>
                </Box>
            );
        default:
            return <></>;
    }
}

export const StatusOrderByStateShort = (dealStatus, claimResult, claimCount = 0, disputeId = '', t) => {
    switch (dealStatus) {
        case "1":
            return (
                <Box bg="blue.300" rounded={"5px"}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px" >{t("Order created")}</Text>
                </Box>
            );
        case "2":
            return (
                <Box bg="pink.300" rounded={"5px"}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order claimed")}</Text>
                </Box>
            );
        case "3":
            return (
                <Box bg="purple.300" rounded={"5px"}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("In dispute")}</Text>
                </Box>
            );
        case "4":
            if (claimCount && disputeId && claimResult !== CLAIM_RESULT_ACCEPTED) {
                return (
                    <Box bg="red.400" rounded={"5px"}>
                        <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim rejected")}</Text>
                    </Box>
                );
            }
            return (
                <Box bg="green.400" rounded={"5px"}>
                    <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order paid")}</Text>
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