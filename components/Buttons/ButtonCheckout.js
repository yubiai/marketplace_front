import { Button, Center, Spinner } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import Loading from '../Spinners/Loading';

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus, operationInProgress }) => {
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
            const amountToWei = global.klerosEscrowInstance.web3.utils.toWei(amount.value.toString())
            const result = await global.klerosEscrowInstance.createTransaction(
                amountToWei, recipient, timeout, metaEvidence)

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
            const transactionIndex = events.MetaEvidence.returnValues._metaEvidenceID;
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
