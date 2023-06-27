import { Button, Center, Spinner } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import {
    getCurrentNetwork,
    getBlockExplorerForNetwork,
    getContractsForNetwork
} from '../../utils/walletUtils';
import { yubiaiArbitrable } from '../../utils/escrow-utils/abis';
import { forToWei } from '../../utils/orderUtils';
import { getContract, getWalletClient, prepareWriteContract, readContract } from '@wagmi/core';
import useContractWriteHook from '../../hooks/contract/useContractWrite';

const WEI_DECIMAL_PLACES = 18;


const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency, yubiaiPaymentArbitrableInstance, address, writeContract, t }) => {
    const global = useGlobal();
    const { amount, recipient } = transactionInfo;
    
    const createTransactionSq = async () => {
        try {
            toggleLoadingStatus(true);
            const senderWallet = address;
            // error
            console.log("Se activo createTransaction sq")
            const amountToWei = await forToWei(amount.value);
            console.log(amountToWei, "amountToWei")
            /* const result = await readContract({
                address: '0x3C8be116dA439ee473ef20d10058b0c99eC9Bd70',
                abi: yubiaiArbitrable,
                functionName: 'deals',
                args: ["1"]
            })  */

            console.log(senderWallet, amountToWei, recipient, "senderWallet, amountToWei, recipient")
            const { data } = await useContractWriteHook(senderWallet, amountToWei, recipient);
            console.log(data, "data")


            toggleLoadingStatus(false);

            return
        } catch (error) {
            console.error('Error creating an Escrow contract: ', error);
            toggleLoadingStatus(false);
        }
    }

    const createTransaction = async () => {
        try {
            toggleLoadingStatus(true);
            const amountToWei = yubiaiPaymentArbitrableInstance.web3.utils.toWei(amount.value.toString());
            const senderWallet = await yubiaiPaymentArbitrableInstance.getAccount();
            console.log(amountToWei, "amountToWei")

            const networkTypeObj = getCurrentNetwork() || {};
            const networkType = (networkTypeObj.aliasTitle) || 'mainnet';
            const networkBaseToken = (networkTypeObj.currency) || 'ETH';
            const blockExplorer = getBlockExplorerForNetwork(networkType);
            const yubiaiContract = getContractsForNetwork(networkType);
            console.log(currency, networkBaseToken, "networkBaseToken")
            const token = currency !== networkBaseToken ? global.currencyPriceList.find(price => price.symbol === currency) : { token_address: null };
            console.log(token, "token")
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
            <Button bg='#00abd1' color={'white'} onClick={yubiaiPaymentArbitrableInstance ? createTransaction : createTransactionSq} isDisabled={operationInProgress && operationInProgress}>{t("Hire service")}</Button>
        </>
    );
};

export default ButtonCheckout;
