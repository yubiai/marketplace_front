import React from 'react';
import { Button } from '@chakra-ui/react';

const ButtonCloseDeal = ({ dealId, toggleLoadingStatus, yubiaiPaymentArbitrableInstance, stepsPostAction }) => {

    const closeDeal = async () => {

        try {
            toggleLoadingStatus(true)
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            const result = await yubiaiPaymentArbitrableInstance.contract.methods.closeDeal(dealId).send({from: senderWallet})
            console.log(result, "result")
            stepsPostAction();
            setTimeout(() => {
                toggleLoadingStatus(false);
            }, 2000);
            return

        } catch (e) {
            console.error(e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "gray.400"
        }} color={'white'} onClick={() => { closeDeal() }}>
            Reclamar Pago
        </Button>
    );
};

export default ButtonCloseDeal;
