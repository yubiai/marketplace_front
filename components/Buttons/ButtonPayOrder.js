import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';
import { useContractWrite } from 'wagmi';

const ButtonPayOrder = ({ transactionInfo, stepsPostAction, toggleLoadingStatus, isSeller, orderCompletedBySeller, contractAddress, yubiaiAbi, t }) => {
    console.log(transactionInfo, "contractAddresscontractAddresscontractAddresscontractAddress")
    const global = useGlobal();
    const { transactionIndex, transactionHash, claimID } = transactionInfo;

    const { write: payOrder } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'closeDeal',
        args: [transactionIndex],
        async onSuccess(data) {
            console.log('Success', data)
            if (data) {
                await orderService.updateOrderStatus(
                    transactionHash, 'ORDER_PAID', global?.profile?.token);
                setTimeout(() => {
                    stepsPostAction();
                    return
                }, 2000);
            }
        },
        onError(error) {
            console.log('Error', error)
            console.log('Error paying transaction: ', error);
            toggleLoadingStatus(false);
        },
    })

    const { write: acceptClaim } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'acceptClaim',
        args: [claimID],
        async onSuccess(data) {
            console.log('Success', data)
            if (data) {
                await orderService.updateOrderStatus(transactionHash, 'ORDER_REFUNDED', global?.profile?.token);
                setTimeout(() => {
                    stepsPostAction();
                    return
                }, 2000);
            }
        },
        onError(error) {
            console.log('Error paying transaction: ', error);
            toggleLoadingStatus(false);
            return
        },
    });

    const payOrderFunc = () => {
        toggleLoadingStatus(true);
        payOrder()
    }

    const acceptClaimFunc = () => {
        toggleLoadingStatus(true);
        acceptClaim()
    }

    return (
        <Button bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "gray.400"
        }} isDisabled={!isSeller && !orderCompletedBySeller} color={'white'} onClick={
            () => {
                isSeller ? acceptClaimFunc() : payOrderFunc()
            }
        }>
            {isSeller ? t("Accept claim") : t("Release payment")}
        </Button>
    );
};

export default ButtonPayOrder;
