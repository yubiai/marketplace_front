import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';

const ButtonPayOrder = ({ transactionInfo, stepsPostAction, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, isSeller, orderCompletedBySeller, t }) => {
    const global = useGlobal();

    const payOrder = async () => {
        const { transactionIndex, transactionHash } = transactionInfo;

        try {
            toggleLoadingStatus(true)
            const parsedTransactionIndex = yubiaiPaymentArbitrableInstance.web3.utils.toNumber(
                transactionIndex);

            const result = await yubiaiPaymentArbitrableInstance.payDeal(parsedTransactionIndex)
            if (result) {
                await orderService.updateOrderStatus(
                    transactionHash, 'ORDER_PAID', global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error paying transaction: ', e);
            toggleLoadingStatus(false);
        }
    };

    const acceptClaim = async () => {
        const { claimId, transactionHash } = transactionInfo;

        try {
            toggleLoadingStatus(true);
            const result = await yubiaiPaymentArbitrableInstance.acceptClaim(claimId);
            if (result) {
                await orderService.updateOrderStatus(transactionHash, 'ORDER_REFUNDED', global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error accepting claim the transaction : ', e);
            toggleLoadingStatus(false);
        }
    }

    return (
        <Button bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "gray.400"
        }} isDisabled={!isSeller && !orderCompletedBySeller} color={'white'} onClick={
            () => {
                isSeller ? acceptClaim() : payOrder()
            }
        }>
            {isSeller ? t("Accept claim") : t("Release payment")}
        </Button>
    );
};

export default ButtonPayOrder;
