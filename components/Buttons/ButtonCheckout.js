import { Button, Center, Spinner } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';

const WEI_DECIMAL_PLACES = 18;

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency, yubiaiPaymentArbitrableInstance }) => {
    const global = useGlobal();
    const { amount, recipient } = transactionInfo;

    const createTransaction = async () => {
        try {
            toggleLoadingStatus(true);
            const amountToWei = yubiaiPaymentArbitrableInstance.web3.utils.toWei(amount.value.toString());
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            const networkType = await yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType() || 'main';
            const token = currency !== 'ETH' ? global.currencyPriceList.find(price => price.symbol === currency) : { token_address: null };
            const result = await yubiaiPaymentArbitrableInstance.createDeal(
                token.token_address,
                burnFee,
                process.env.NEXT_PUBLIC_TIME_FOR_SERVICE,
                process.env.NEXT_PUBLIC_TIME_FOR_CLAIM,
                senderWallet,
                recipient,
                String(amountToWei),
                process.env.NEXT_PUBLIC_TERMS_URL_DEFAULT
            );

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

            const { dealId, deal } = events.DealCreated.returnValues;

            const transactionPayedAmount = deal.amount;
            const parsedTransactionPayedAmountInETH = parseFloat(yubiaiPaymentArbitrableInstance.web3.utils.fromWei(
                transactionPayedAmount), 10);
            const finalCalculationForFee = parsedTransactionPayedAmountInETH - (
                parsedTransactionPayedAmountInETH / 100 * (parseInt(deal.extraBurnFee, 10) / 100)
            );

            const transactionFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(finalCalculationForFee.toFixed(WEI_DECIMAL_PLACES));
            const {
                claimCount,
                createdAt,
                currentClaim,
                state,
                timeForService,
                timeForClaim
            } = deal;

            await createOrder({
                from,
                to,
                transactionMeta: {
                    transactionHash,
                    blockHash,
                    blockNumber,
                    cumulativeGasUsed,
                    effectiveGasPrice,
                },
                transactionState: parseInt(state, 10),
                claimCount: parseInt(claimCount, 10),
                timeForService: parseInt(timeForService, 10),
                timeForClaim: parseInt(timeForClaim, 10),
                currentClaim: parseInt(currentClaim, 10),
                transactionIndex: dealId,
                transactionPayedAmount,
                transactionFeeAmount,
                transactionDate: createdAt,
                networkEnv: networkType || 'mainnet'
            });
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
    return (
       <>
        {operationInProgress && (
        <Center >
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
              />
        </Center>
        )}
        <Button bg='#00abd1' color={'white'} onClick={createTransaction} isDisabled={operationInProgress && operationInProgress}>Hire service</Button>
       </>
    );
};

export default ButtonCheckout;
