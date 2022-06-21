import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';

const ButtonPayOrder = ({ transactionIndex, amount, transactionHash, stepsPostAction, toggleLoadingStatus, tokenSymbol }) => {
    const global = useGlobal()
    const payOrder = async () => {
        try {
            toggleLoadingStatus(true)
            const parsedTransactionIndex = global.klerosEscrowInstance.web3.utils.toNumber(
                transactionIndex);

            const amountToWei = global.klerosEscrowInstance.web3.utils.toWei(amount.toString());

            if (tokenSymbol !== 'ETH') {
                await global.klerosEscrowInstance.pay(parsedTransactionIndex, amountToWei)
                await orderService.updateOrderStatus(
                    transactionHash, 'ORDER_PAID', global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            } else {
                global.klerosEscrowInstance.pay(parsedTransactionIndex, amountToWei);
                window.setTimeout(async () => {
                    await orderService.updateOrderStatus(
                        transactionHash, 'ORDER_PAID', global?.profile?.token);
                    stepsPostAction();
                    toggleLoadingStatus(false);
                }, 5000);
            }
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
    return (
        <Button bg='#00abd1' m="5px" color={'white'} onClick={payOrder}>Release payment</Button>
    );
};

export default ButtonPayOrder;
