import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';

// FIXME: Implement fee amount from configuration
const fixedFeeAmount = 0.025;

const ButtonPayOrder = ({ transactionInfo, stepsPostAction, toggleLoadingStatus, yubiaiPaymentArbitrableInstance }) => {
    const global = useGlobal();


    const challengeClaim = async () => {
        const { claimId, transactionHash } = transactionInfo;
        const parsedFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(String(fixedFeeAmount));

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
        <Button bg='#00abd1' color={'white'} width="200px" onClick={() => challengeClaim()}>
          Challenge claim
        </Button>
    );
};

export default ButtonPayOrder;
