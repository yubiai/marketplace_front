import { Button, Center, Spinner } from '@chakra-ui/react';
import {
    getBlockExplorerForNetwork,
    getContractsForNetwork
} from '../../utils/walletUtils';
import { formatDayBySeconds } from '../../utils/orderUtils';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';
import { yubiaiArbitrable } from '../../utils/escrow-utils/abis';

const createTransaction = async (data, dealId, amount, timeForService, timeForClaim, typeprice, networkType, blockExplorer, contractAddress, createOrder, toggleLoadingStatus) => {
    try {
        const {
            blockHash,
            blockNumber,
            cumulativeGasUsed,
            effectiveGasPrice,
            from,
            to,
            transactionHash
        } = data;

        const transactionPayedAmount = amount.toString();

        let transactionFeeAmount = "0";

        const blockNumberString = blockNumber.toString()
        const cumulativeGasUsedString = cumulativeGasUsed.toString()
        const effectiveGasPriceString = effectiveGasPrice.toString()

        await createOrder({
            from,
            to,
            transactionMeta: {
                transactionHash,
                blockHash,
                blockNumberString,
                cumulativeGasUsedString,
                effectiveGasPriceString,
                contractAddressURI: `${blockExplorer}/address/${contractAddress}`
            },
            transactionState: parseInt(1, 10),
            claimCount: parseInt(0, 10),
            timeForService: parseInt(timeForService, 10),
            timeForClaim: parseInt(timeForClaim, 10),
            currentClaim: parseInt(0, 10),
            typeprice: typeprice,
            transactionIndex: dealId.toString(),
            transactionPayedAmount,
            transactionFeeAmount,
            transactionDate: Math.floor((new Date()).getTime() / 1000),
            networkEnv: networkType
        });
    } catch (e) {
        console.log('Error creating an Escrow contract: ', e);
        toggleLoadingStatus(false);
    }
};

const ButtonCheckout = ({ addressAccount, transactionInfo, createOrder, toggleLoadingStatus, operationInProgress, burnFee, currency, chain, router, toast, t }) => {

    const networkType = chain.name.toLowerCase();
    const networkBaseToken = chain.nativeCurrency.symbol;
    const networkData = getBlockExplorerForNetwork(networkType);
    const blockExplorer = networkData.blockExplorer;
    const yubiaiContract = getContractsForNetwork(networkType);

    if (networkBaseToken != currency) {
        router.push("/logout");
        return;
    }

    const { amount, recipient, time_for_claim, time_for_service, typeprice } = transactionInfo;

    const amountToWei = ethers.utils.parseEther(amount.value.toString());

    const termsUrl = process.env.NEXT_PUBLIC_TERMS_URL_DEFAULT

    //Preparando el contrato
    const { config } = usePrepareContractWrite({
        address: yubiaiContract.yubiaiArbitrable,
        abi: yubiaiArbitrable,
        functionName: 'createDealWithValue',
        account: addressAccount,
        args: [
            [
                Number(amountToWei),
                addressAccount,
                0,
                burnFee * 100,
                0,
                0,
                recipient,
                Math.floor((new Date()).getTime() / 1000),
                time_for_service ? formatDayBySeconds(time_for_service) : process.env.NEXT_PUBLIC_TIME_FOR_SERVICE,
                time_for_claim ? formatDayBySeconds(time_for_claim) : process.env.NEXT_PUBLIC_TIME_FOR_CLAIM,
                networkData.token_address,
                0,
                0
            ], termsUrl
        ]
    });

    // Use Contract
    const { data, isLoading: isLoadingWrite, write } = useContractWrite(config);

    // Use Wait for transaction
    const { isLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            toggleLoadingStatus(true);

            const decodedEvent = ethers.utils.defaultAbiCoder.decode(
                [
                    'uint64'
                ],
                data.logs[1].topics[1]
            );
            const dealId = decodedEvent[0].toNumber()
 
            createTransaction(data, dealId, Number(amountToWei), time_for_service ? formatDayBySeconds(time_for_service) : process.env.NEXT_PUBLIC_TIME_FOR_SERVICE, time_for_claim ? formatDayBySeconds(time_for_claim) : process.env.NEXT_PUBLIC_TIME_FOR_CLAIM, typeprice, networkType, blockExplorer, yubiaiContract.yubiaiArbitrable, createOrder, toggleLoadingStatus);
        },
        onError(error) {
            console.log('Error', error)
            toast({
                id: "Error metamask",
                title: 'Error Checkout',
                description: error.name,
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }
    });

    return (
        <>
            {operationInProgress || isLoading && (
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
            <Button bg='#00abd1' color={'white'} onClick={() => write?.()} isDisabled={operationInProgress || isLoadingWrite || isLoading}>{t("Hire service")}</Button>
        </>
    );
};

export default ButtonCheckout;
