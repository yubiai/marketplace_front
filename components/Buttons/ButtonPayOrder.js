import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';

const ButtonPayOrder = ({ transactionIndex, amount, transactionHash, stepsPostAction, toggleLoadingStatus }) => {
    const global = useGlobal()
    const payOrder = async () => {
        try {
            toggleLoadingStatus(true)
            const parsedTransactionIndex = global.klerosEscrowInstance.web3.utils.toNumber(
                transactionIndex);

            const result = await global.klerosEscrowInstance.pay(parsedTransactionIndex, amount)
            if (result) {
                await orderService.updateOrderStatus(
                    transactionHash, 'ORDER_PAID', global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={payOrder}>Release payment</Button>
    );
};

export default ButtonPayOrder;
