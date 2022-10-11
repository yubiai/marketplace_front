import { Button, Center, Spinner } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'

const TIME_FOR_SERVICE = 259200;
const TIME_FOR_CLAIM = 259200;
const TERMS_URL_DEFAULT = "https://forum.kleros.io/tos";

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency, yubiaiPaymentArbitrableInstance }) => {
    const global = useGlobal()
    const { amount, recipient, timeout, title, description, extraData } = transactionInfo
    const metaEvidence = {
        title,
        description,
        extraData
    };

    const createTransaction = async () => {
        try {
            toggleLoadingStatus(true);
            const amountToWei = yubiaiPaymentArbitrableInstance.web3.utils.toWei(amount.value.toString());
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            const networkType = await yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType() || 'main';
            const token = global.currencyPriceList.find(price => price.symbol === currency);
            const result = await yubiaiPaymentArbitrableInstance.createDeal(
                token.token_address, burnFee, TIME_FOR_SERVICE, TIME_FOR_CLAIM, senderWallet, recipient, String(amountToWei), TERMS_URL_DEFAULT);

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

            const transactionFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(String(finalCalculationForFee));

            await createOrder({
                blockHash,
                blockNumber,
                cumulativeGasUsed,
                effectiveGasPrice,
                from,
                to,
                transactionHash,
                transactionIndex: dealId,
                transactionPayedAmount,
                transactionFeeAmount,
                transactionDate: Math.round((new Date()).getTime() / 100),
                networkEnv: networkType || 'mainnet'
            })
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
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
