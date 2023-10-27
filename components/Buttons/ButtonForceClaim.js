import React, { useState } from 'react';
import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { orderService } from '../../services/orderService';
import { useGlobal } from '../../providers/globalProvider';
import { useContractWrite } from 'wagmi';
import moment from 'moment';

const ButtonForceClaim = ({ transactionInfo, stepsPostAction, toggleLoadingStatus, contractAddress, yubiaiAbi, toast, t }) => {
    const global = useGlobal();
    const { transactionHash, claim } = transactionInfo;
    const [errorInfo, setErrorInfo] = useState(null);

    const { write: acceptClaim } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'acceptClaim',
        args: [claim.claimID],
        async onSuccess(data) {
            console.log('Success', data)
            if (data) {
                setErrorInfo(null)
                await orderService.updateOrderStatus(transactionHash, 'ORDER_REFUNDED', global?.profile?.token);
                setTimeout(() => {
                    stepsPostAction();
                    toast({
                        title: t('Order'),
                        description: t('Successfully changed the status'),
                        position: 'top-right',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      })
                    return
                }, 2000);
            }
        },
        onError(error) {
            setErrorInfo(error.message, "error")
            toast({
                title: "Error",
                position: 'top-right',
                status: 'warning',
                duration: 3000,
                isClosable: true
              });
            toggleLoadingStatus(false);
            return
        },
    });

    const acceptClaimFunc = () => {
        toggleLoadingStatus(true);
        acceptClaim()
    }

    return (
        <>
            <Button mt="1em" bg='#00abd1' w={{ base: "100%", md: "200px" }} isDisabled={moment().unix() < claim.claimCreatedAt + claim.timeForChallenge} _hover={{
                bg: "blue.300"
            }} color={'white'} onClick={() => { acceptClaimFunc() }}>
                {t("Claim Payment")}
            </Button>
            {errorInfo && (
                <Alert mt="1em" status='error'>
                    <AlertIcon />
                    {t("Claim Error Buyer")}
                </Alert>
            )}
        </>
    );
};

export default ButtonForceClaim;
