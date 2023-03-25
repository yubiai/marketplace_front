import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { orderService } from '../../services/orderService';
import { useGlobal } from '../../providers/globalProvider';
import { useRouter } from 'next/router';

const ButtonCloseDeal = ({ dealId, transactionHash, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, stepsPostAction, t }) => {
    const global = useGlobal();
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);

    const closeDeal = async () => {

        if(!global.profile.token || !transactionHash || !dealId){
            router.push("/logout");
            return
        }

        try {
            setIsDisabled(true);
            toggleLoadingStatus(true)
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            await yubiaiPaymentArbitrableInstance.contract.methods.closeDeal(dealId).send({ from: senderWallet });

            await orderService.updateOrderStatus(transactionHash, 'ORDER_CLOSE_DEAL', global.profile.token);

            stepsPostAction();
            toggleLoadingStatus(false);
            return
        } catch (e) {
            console.error('Error close deal the transaction : ', e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button isDisabled={isDisabled} bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "gray.400"
        }} color={'white'} onClick={() => { closeDeal() }}>
            {t("Claim Payment")}
        </Button>
    );
};

export default ButtonCloseDeal;
