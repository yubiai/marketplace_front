import Web3 from 'web3'
import React, { useEffect, useState } from 'react'
import { Button, Center, Spinner } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import { getContractsForNetwork } from '../../utils/walletUtils'
import PaymentProcessor from '../../utils/escrow-utils/paymentProcessor'

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency }) => {
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
            const amountToWei = global.klerosEscrowInstance.web3.utils.toWei(amount.value.toString());
            const senderWallet = await global.klerosEscrowInstance.getAccount();
            const networkType = await global.klerosEscrowInstance.web3.eth.net.getNetworkType() || 'main';
            const contracts = getContractsForNetwork(networkType);
            const ETH = global.currencyPriceList.find(currency => currency.symbol === 'ETH');
            const token = global.currencyPriceList.find(price => price.symbol === currency);

            const transferInfo = {
                token: (currency !== 'ETH' && token) ? token.token_address : '0x0000000000000000000000000000000000000000',
                tokenETHRate: token ? Math.round(ETH.price > token.price ? ETH.price / token.price : token.price / ETH.price) : 1,
                ETHPriceGreaterThanToken: !!(token && ETH.price > token.price)
            };
            const transactionData = {
                sender: senderWallet,
                timeoutPayment: timeout,
                receiver: recipient,
                metaEvidence
            };

            const result = await paymentProcessorInstance.managePayment(
                amountToWei, 5, burnFee, transferInfo, transactionData);

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
                item => item.address.toLowerCase() === contracts.yubiaiArbitrable.toLowerCase()) || {};

            const transactionPayedAmount = events.PaymentDone.returnValues.amount;
            const transactionFeeAmount = String(amountToWei - transactionPayedAmount);
            const transactionDate = events.PaymentDone.returnValues.date;

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
                transactionPayedAmount,
                transactionFeeAmount,
                transactionDate,
                networkEnv: networkType || 'mainnet'
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
