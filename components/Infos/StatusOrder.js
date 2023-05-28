import { Box, Link, Text } from "@chakra-ui/react";
import EvidenceDetailCard from "../Cards/EvidenceDetailCard";

export const NONE_STATUS = "0";
export const ONGOING_STATUS = "1";
export const CLAIMED_STATUS = "2";
export const DISPUTED_STATUS = "3";
export const FINISHED_STATUS = "4";

export const CLAIM_RESULT_REJECTED = "1";
export const CLAIM_RESULT_ACCEPTED = "2";

export const StatusOrder = (status, t) => {
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

export const StatusOrderByState = (deal = {}, claim = {}, t) => {
  const status = statusDescMap(deal, claim);
  switch (status) {
    case "ORDER_CREATED":
      return (
        <Box bg="blue.500" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order created")}</Text>
        </Box>
      );
    case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
      return (
        <>
          <Box bg="pink.300" rounded={"5px"} p="5px" w={{ base: "100%", md: "max-content" }}>
            <Text fontSize={"larger"} fontStyle="normal" color="black" pl="15px" pr="15px">{t("The buyer has claimed a refund for this order")} (N° {claim.claimCount})</Text>
          </Box>
          <EvidenceDetailCard claim={claim} />
        </>
      );
    case "ORDER_DISPUTE_IN_PROGRESS":
      return (
        <Box bg="purple.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Dispute in progress")} (Dispute Id: {claim.disputeId} - Claim Id: {claim.claimID}) </Text>
          <Link href={process.env.NEXT_PUBLIC_COURT_CASES + claim.disputeId} isExternal color="white" pl="15px" pr="15px">{process.env.NEXT_PUBLIC_COURT_CASES + claim.disputeId}</Link>
        </Box>
      );
    case "CLAIM_REJECTED":
    case "CLAIM_REJECTED_LIMIT_REACHED":
      //const claimLimitReaches = claim.claimCount === claim.maxClaimsAllowed;
      return (
        <Box bg="purple.300" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
          <Text color="black" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim rejected")} {
            status === "CLAIM_REJECTED_LIMIT_REACHED"
              ? t("You reached the limit of claims you can do to the seller")
              : ` ${t("Opportunities to try a new claim")}  ${claim.maxClaimsAllowed - claim.claimCount}`
          }</Text>
        </Box>
      );
    case "CLAIM_WON_BY_BUYER":
      return (
        <Box bg="green.500" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim won")}</Text>
        </Box>
      );
    case "ORDER_PAID":
      return (
        <Box bg="green.400" rounded={"5px"} w={{ base: "100%", md: "max-content" }}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order paid")}</Text>
        </Box>
      );
    default:
      return <></>;
  }
}

export const StatusOrderByStateShort = (deal = {}, claim = {}, t) => {
  const status = statusDescMap(deal, claim);
  switch (status) {
    case "ORDER_CREATED":
      return (
        <Box bg="blue.300" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order created")}</Text>
        </Box>
      );
    case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
      return (
        <Box bg="pink.300" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order claimed")}</Text>
        </Box>
      );
    case "ORDER_DISPUTE_IN_PROGRESS":
      return (
        <Box bg="purple.300" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("In dispute")}</Text>
        </Box>
      );
    case "CLAIM_REJECTED":
    case "CLAIM_REJECTED_LIMIT_REACHED":
      return (
        <Box bg="red.400" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim rejected")}</Text>
        </Box>
      );
    case "CLAIM_WON_BY_BUYER":
      return (
        <Box bg="green.400" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Claim won")}</Text>
        </Box>
      );
    case "ORDER_PAID":
      return (
        <Box bg="green.400" rounded={"5px"}>
          <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order paid")}</Text>
        </Box>
      );
    default:
      return <></>;
  }
}

export const statusDescMap = (deal = {}, claim = {}) => {
  console.log(deal, claim, "asd")
  switch (deal.dealStatus) {
    case "1":
      if (claim.claimID != "0") {
        if (claim.claimSolvedAt && claim.claimStatus === "2") {
          return "CLAIM_WON_BY_BUYER";
        } else if (claim.claimSolvedAt) {
          const claimLimitReaches = claim.claimCount === claim.maxClaimsAllowed;
          if (claimLimitReaches) {
            return "CLAIM_REJECTED_LIMIT_REACHED";
          }
          return "CLAIM_REJECTED";
        }
      }
      return "ORDER_CREATED";
    case "2":
      return "ORDER_DISPUTE_RECEIVER_FEE_PENDING";
    case "3":
      return "ORDER_DISPUTE_IN_PROGRESS";
    case "4":
      if (claim.claimCount > 0 && claim.claimStatus == "0") {
        return "ORDER_REFUNDED";
      }
      if (claim.claimCount > 0 && claim.claimStatus == "2") {
        return "CLAIM_WON_BY_BUYER";
      }
      return "ORDER_PAID";
    default:
      return "UNKNOWN_STATE";
  }
}