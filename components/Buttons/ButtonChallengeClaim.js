import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';
import { evidenceService } from '../../services/evidenceService';

const ButtonChallengeClaim = ({ transactionInfo, stepsPostAction, evidenceID, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, t }) => {
    const global = useGlobal();

    const challengeClaim = async () => {
        const { claimID, transactionHash } = transactionInfo;
        const parsedFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(String(process.env.NEXT_PUBLIC_FEE_ARBITRATION));

        try {
            toggleLoadingStatus(true);
            await yubiaiPaymentArbitrableInstance.challengeClaim(claimID, parsedFeeAmount);

            await evidenceService.updateStatus(evidenceID, {
                status: 2
            }, global?.profile?.token);
            await orderService.updateOrderStatus(transactionHash, 'ORDER_DISPUTE_IN_PROGRESS', global?.profile?.token);

            stepsPostAction();
            toggleLoadingStatus(false);
            return
        } catch (e) {
            console.error('Error accepting claim the transaction : ', e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button bg='red.400' color={'white'} w={{ base: "100%", md: "200px" }} onClick={() => challengeClaim()}>
            {t("Challenge claim")}
        </Button>
    );
};

export default ButtonChallengeClaim;
