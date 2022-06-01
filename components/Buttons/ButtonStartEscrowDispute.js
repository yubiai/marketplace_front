import { Button } from '@chakra-ui/react'
import { useGlobal } from '../../providers/globalProvider'
import { parsePriceToETHAmount } from '../../utils/orderUtils'

const ButtonStartEscrowDispute = ({ transactionIndex, amount }) => {
    const global = useGlobal()
    const startEscrowDispute = async () => {
        try {
            const transactionIndexParsed = global.klerosEscrowInstance.web3.utils.toNumber(
                transactionIndex);
            const ethContract = global.currencyPriceList.find(
                currencyObject => currencyObject.symbol === 'ETH');
            const parsedETHPrice = parsePriceToETHAmount(
                amount, ethContract, global.klerosEscrowInstance.web3);

            const result = await global.klerosEscrowInstance.payArbitrationFee(
                transactionIndexParsed, parsedETHPrice)
            console.log('Result: ', result)
        } catch (e) {
            console.log('Error creating an Escrow contract: ', e);
        }
    };
  
    return (
        <Button bg='#00abd1' color={'white'} onClick={startEscrowDispute}>Start dispute</Button>
    );
};

export default ButtonStartEscrowDispute;
