import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import { orderService } from '../../services/orderService'
import { parsePriceToETHAmount } from '../../utils/orderUtils'

const ButtonEscrowDispute = ({
    transaction,
    transactionIndex,
    amount,
    asSeller=false,
    transactionHash,
    stepsPostAction,
    toggleLoadingStatus
}) => {
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
                transaction, transactionIndexParsed, parsedETHPrice);

            if (result) {
                const status = asSeller ? 'ORDER_DISPUTE_IN_PROGRESS' : 'ORDER_DISPUTE_RECEIVER_FEE_PENDING';

                if (asSeller) {
                    const eventDispute = result.events.Dispute;
                    if (eventDispute) {
                        const disputeId = eventDispute.returnValues._disputeID;
                        await orderService.setDisputeOnOrderTransaction(
                            transactionHash, parseInt(disputeId, 10), global?.profile?.token);
                    }
                }

                await orderService.updateOrderStatus(
                    transactionHash, status, global?.profile?.token);
                stepsPostAction();
                toggleLoadingStatus(false);
            }
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
            toggleLoadingStatus(false);
        }
    };
  
    return (
        <Button bg='red' color={'white'} onClick={startEscrowDispute}>
            {asSeller ? 'Pay arbitration fee' : 'Start dispute'}
        </Button>
    );
};

export default ButtonEscrowDispute;
