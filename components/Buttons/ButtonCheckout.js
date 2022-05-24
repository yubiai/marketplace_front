import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useGlobal } from '../../providers/globalProvider'

const ButtonCheckout = ({ transactionInfo }) => {
    const global = useGlobal()
    const { amount, recipient, timeout, title, description, fileURI } = transactionInfo
    const metaEvidence = {
        title,
        description,
        fileURI,
    };

    const createTransaction = async () => {
        try {
            const result = await global.klerosEscrowInstance.createTransaction(
                amount.value, recipient, timeout, metaEvidence)  
            setTransactionId(result.transactionIndex)
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={createTransaction}>Checkout</Button>
    );
};

export default ButtonCheckout;
