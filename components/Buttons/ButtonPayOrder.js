import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'

const ButtonCheckout = ({ transactionIndex }) => {
    const global = useGlobal()
    const payOrder = async () => {
        try {
            // uint256
            console.log('Transaction Index:: ', transactionIndex);
            const n = global.klerosEscrowInstance.web3.utils.toNumber(transactionIndex);
            console.log('Params::: ', global.klerosEscrowInstance.web3.utils.toBN(transactionIndex ))

            // .pay(n, 1e15)
            const result = await global.klerosEscrowInstance.executeTransaction(
                global.klerosEscrowInstance.web3.utils.toBN(500)
            )
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
