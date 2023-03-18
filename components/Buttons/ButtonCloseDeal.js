import React from 'react';
import { Button } from '@chakra-ui/react';
import { orderService } from '../../services/orderService';

const ButtonCloseDeal = ({ dealId, transactionHash, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, stepsPostAction, t }) => {

    const closeDeal = async () => {

        try {
            toggleLoadingStatus(true)
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            await yubiaiPaymentArbitrableInstance.contract.methods.closeDeal(dealId).send({from: senderWallet});
            await orderService.updateOrderStatus(transactionHash, 'ORDER_CLOSE_DEAL', global?.profile?.token);
            stepsPostAction();
            setTimeout(() => {
                toggleLoadingStatus(false);
            }, 2000);
            return

        } catch (e) {
            console.error('Error close deal the transaction : ', e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "gray.400"
        }} color={'white'} onClick={() => { closeDeal() }}>
            {t("Claim Payment")}
        </Button>
    );
};

export default ButtonCloseDeal;
