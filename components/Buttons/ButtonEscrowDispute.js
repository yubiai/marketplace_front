import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import { orderService } from '../../services/orderService'
import { parsePriceToETHAmount } from '../../utils/orderUtils'

const ButtonEscrowDispute = ({
    transactionIndex, amount, asSeller=false, transactionHash, stepsPostAction, toggleLoadingStatus }) => {
    const global = useGlobal()
    const startEscrowDispute = async () => {
        try {
            toggleLoadingStatus(true);
            const transactionIndexParsed = global.klerosEscrowInstance.web3.utils.toNumber(
                transactionIndex);
            const ethContract = global.currencyPriceList.find(
                currencyObject => currencyObject.symbol === 'ETH');
            const parsedETHPrice = parsePriceToETHAmount(
                amount, ethContract, global.klerosEscrowInstance.web3);

            const result = await global.klerosEscrowInstance.payArbitrationFee(
                transactionIndexParsed, parsedETHPrice)
            if (result) {
                const status = asSeller ? 'ORDER_DISPUTE_IN_PROGRESS' : 'ORDER_DISPUTE_RECEIVER_FEE_PENDING';
                await orderService.updateOrderStatus(transactionHash, status);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={startEscrowDispute}>
            {asSeller ? 'Pay arbitration fee' : 'Start dispute'}
        </Button>
    );
};

export default ButtonEscrowDispute;
