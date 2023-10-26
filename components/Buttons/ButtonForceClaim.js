import React, { useState } from 'react';
import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { orderService } from '../../services/orderService';
import { useGlobal } from '../../providers/globalProvider';
import { useContractWrite } from 'wagmi';

const ButtonForceClaim = ({ transactionInfo, toggleLoadingStatus, contractAddress, yubiaiAbi, stepsPostAction, toast, t }) => {
    const global = useGlobal();
    const { transactionHash, claimID } = transactionInfo;
    const [errorInfo, setErrorInfo] = useState(null);

    const { write: acceptClaim } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'acceptClaim',
        args: [claimID],
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
            <Button bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
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
