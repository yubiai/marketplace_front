import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'

const ButtonCheckout = ({ transactionIndex }) => {
    const global = useGlobal()
    const startEscrowDispute = async () => {
        try {
            console.log('Transaction Index:: ', transactionIndex);
            const n = global.klerosEscrowInstance.web3.utils.toNumber(transactionIndex);
            const result = await global.klerosEscrowInstance.payArbitrationFee(
                n, 1e16)
            console.log('Result:: ', result);
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={startEscrowDispute}>Start dispute</Button>
    );
};

export default ButtonCheckout;
