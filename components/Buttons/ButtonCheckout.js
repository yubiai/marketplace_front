import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'

const ButtonCheckout = ({ transactionInfo, createOrder, toggleLoadingStatus }) => {
    const global = useGlobal()
    const { amount, recipient, timeout, title, description, fileURI } = transactionInfo
    const metaEvidence = {
        title,
        description,
        fileURI,
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
        <Button bg='#00abd1' color={'white'} onClick={createTransaction}>Checkout</Button>
    );
};

export default ButtonCheckout;
