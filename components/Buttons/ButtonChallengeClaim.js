import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';

const ButtonPayOrder = ({ transactionInfo, stepsPostAction, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, t }) => {
    const global = useGlobal();


    const challengeClaim = async () => {
        const { claimId, transactionHash } = transactionInfo;
        const parsedFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(String(process.env.NEXT_PUBLIC_FEE_ARBITRATION));

        try {
            toggleLoadingStatus(true);
            const result = await yubiaiPaymentArbitrableInstance.challengeClaim(claimId, parsedFeeAmount);
            if (result) {
                await orderService.updateOrderStatus(transactionHash, 'ORDER_DISPUTE_IN_PROGRESS', global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error accepting claim the transaction : ', e);
            toggleLoadingStatus(false);
        }
    }
  
    return (
        <Button bg='red.400' color={'white'} w={{base: "100%", md: "200px"}} onClick={() => challengeClaim()}>
          {t("Challenge claim")}
        </Button>
    );
};

export default ButtonPayOrder;
