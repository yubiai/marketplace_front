import { Button, Center, Spinner } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import {
    getCurrentNetwork,
    getBlockExplorerForNetwork,
    getContractsForNetwork
} from '../../utils/walletUtils';
import { formatDayBySeconds } from '../../utils/orderUtils';

const WEI_DECIMAL_PLACES = 18;

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency, yubiaiPaymentArbitrableInstance, t }) => {
    const global = useGlobal();

    const { amount, recipient, time_for_claim, time_for_service, typeprice } = transactionInfo;

    const createTransaction = async () => {
        try {
            toggleLoadingStatus(true);
            const amountToWei = yubiaiPaymentArbitrableInstance.web3.utils.toWei(amount.value.toString());
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();

            const networkTypeObj = getCurrentNetwork() || {};
            const networkType = (networkTypeObj.aliasTitle) || 'mainnet';
            const networkBaseToken = (networkTypeObj.currency) || 'ETH';
            const blockExplorer = getBlockExplorerForNetwork(networkType);
            const yubiaiContract = getContractsForNetwork(networkType);

            const token = currency !== networkBaseToken ? global.currencyPriceList.find(price => price.symbol === currency) : { token_address: null };
            const result = await yubiaiPaymentArbitrableInstance.createDeal(
                token.token_address,
                burnFee,
                time_for_service ? formatDayBySeconds(time_for_service) : process.env.NEXT_PUBLIC_TIME_FOR_SERVICE,
                time_for_claim ? formatDayBySeconds(time_for_claim) : process.env.NEXT_PUBLIC_TIME_FOR_CLAIM,
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

            let transactionFeeAmount = 0;

            if (deal.extraBurnFee > 0) {

                const finalCalculationForFee = parsedTransactionPayedAmountInETH - (
                    parsedTransactionPayedAmountInETH / 100 * (parseInt(deal.extraBurnFee, 10) / 100)
                );

                transactionFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(finalCalculationForFee.toFixed(WEI_DECIMAL_PLACES));
            } else {
                transactionFeeAmount = 0;
            }

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
                    contractAddressURI: `${blockExplorer}/address/${yubiaiContract.yubiaiArbitrable}`
                },
                transactionState: parseInt(state, 10),
                claimCount: parseInt(claimCount, 10),
                timeForService: parseInt(timeForService, 10),
                timeForClaim: parseInt(timeForClaim, 10),
                currentClaim: parseInt(currentClaim, 10),
                typeprice: typeprice,
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
            <Button bg='#00abd1' color={'white'} onClick={createTransaction} isDisabled={operationInProgress && operationInProgress}>{t("Hire service")}</Button>
        </>
    );
};

export default ButtonCheckout;
