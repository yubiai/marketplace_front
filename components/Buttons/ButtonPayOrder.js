import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'

const ButtonCheckout = ({ transactionIndex }) => {
    const global = useGlobal()
    const payOrder = async () => {
        try {
            // uint256
            const n = global.klerosEscrowInstance.web3.utils.toNumber(transactionIndex);

            const result = await global.klerosEscrowInstance.pay(n, 1e15)
            console.log('Result on pay::: ', result);
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={payOrder}>Pay order</Button>
    );
};

export default ButtonCheckout;
