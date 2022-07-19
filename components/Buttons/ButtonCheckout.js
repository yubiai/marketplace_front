import Web3 from 'web3'
import React, { useEffect, useState } from 'react'
import { Button, Center, Spinner } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import PaymentProcessor from '../../utils/escrow-utils/paymentProcessor'

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, currency }) => {
    const global = useGlobal()
    const [paymentProcessorInstance, setPaymentProcessorInstance] = useState(null)
    const { amount, recipient, timeout, title, description, extraData } = transactionInfo
    const metaEvidence = {
        title,
        description,
        extraData
    };

    const createTransaction = async () => {
        try {
            toggleLoadingStatus(true);
            const amountToWei = global.klerosEscrowInstance.web3.utils.toWei(amount.value.toString())

            /**
             * Default Burn Fee: 1%
             */
            const result = await paymentProcessorInstance.managePayment(
                amountToWei, 5, 1, timeout, recipient, metaEvidence);

            const {
                blockHash,
                blockNumber,
                cumulativeGasUsed,
                effectiveGasPrice,
                from,
                to,
                transactionHash,
                events
            } = result;
            const metaEvidenceObj = events.MetaEvidence.find(
                item => item.address.toLowerCase() === global.klerosEscrowInstance.arbitratorContract.toLowerCase()) || {};
            const transactionIndex = (metaEvidenceObj.returnValues || {})._metaEvidenceID;
            await createOrder({
                blockHash,
                blockNumber,
                cumulativeGasUsed,
                effectiveGasPrice,
                from,
                to,
                transactionHash,
                transactionIndex,
                networkEnv: process.env.NEXT_PUBLIC_NETWORK || 'mainnet'
            })
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };

    useEffect(() => {
        if (!paymentProcessorInstance && global.klerosEscrowInstance) {
            const web3 = new Web3(
                process.env.NEXT_PUBLIC_INFURA_ENDPOINT ||
                new Web3.providers.HttpProvider('http://localhost:8545')
            );
            setPaymentProcessorInstance(
                new PaymentProcessor(
                    web3,
                    global?.profile?.eth_address.toLowerCase(),
                    global?.klerosEscrowInstance
                )
            )
        }
    }, [paymentProcessorInstance, global.klerosEscrowInstance])
  
    return (
       <>
        {operationInProgress && (
        <Center >
            <Spinner />
        </Center>
        )}
        <Button bg='#00abd1' color={'white'} onClick={createTransaction} isDisabled={operationInProgress && operationInProgress}>Hire service</Button>
       </>
    );
};

export default ButtonCheckout;
