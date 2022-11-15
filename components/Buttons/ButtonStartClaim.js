import React from 'react';
import { Link } from '@chakra-ui/react';

const ButtonStartClaim = ({ transactionMeta, isSeller }) => {  
    return (
        <Link href={`/profile/evidences/new/${transactionMeta.transactionHash}`}
              size="sm" bg="green.500" color="white" _hover={{ bg: "gray.400" }}
              borderRadius="0.375rem" height="40px" width={isSeller ? "200px" : "120px"}
              textAlign="center" fontWeight="bold"
              display="flex" justifyContent="center" alignItems="center">
            { isSeller ? "Challenge claim" : "Start claim" }
        </Link>
    );
};

export default ButtonStartClaim;
