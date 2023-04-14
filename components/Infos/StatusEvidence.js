import { Badge } from "@chakra-ui/react";


export const StatusEvidence = (status) => {
  switch (status) {
    case 0:
      return (
        <Badge bg='gray.500' color='white'>Evidence New</Badge>
      );
    case 1:
      return (
        <Badge bg='orange.500' color='white'>Dispute receiver fee pending</Badge>
      );
    case 2:
      return (
        <Badge bg='blue.500' color='white'>Dispute In Progress</Badge>
      );
    default:
      return <></>;
  }
}
