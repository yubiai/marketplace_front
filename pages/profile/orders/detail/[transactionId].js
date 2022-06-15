import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import {
  useGlobal,
  useDispatchGlobal,
} from '../../../../providers/globalProvider'
import { getCurrentWallet } from '../../../../utils/walletUtils'
import {
  translateStatusIdToNamingInTransaction
} from '../../../../utils/orderUtils'
import {
  loadCurrencyPrices,
  loadOrderData,
  setKlerosInstance,
  setArbitratorInstance
} from '../../../../providers/orderProvider'
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder'
import ButtonEscrowDispute from '../../../../components/Buttons/ButtonEscrowDispute'
import Loading from '../../../../components/Spinners/Loading'
import Link from 'next/link'

import { Box, Container, Text, Heading, Flex, Button } from '@chakra-ui/react'

const minimumArbitrationFeeUSD = 90

const OrderDetail = () => {
  const router = useRouter()
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { transactionId } = router.query
  const [orderDetail, setOrderDetail] = useState({})
  const [transactionData, setTransactionData] = useState({})
  const [operationInProgress, setOperationInProgress] = useState(false)
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(transactionId)
    const { data } = response
    const orderInfo = data.result

    const { transaction } = await loadOrderData(
      orderInfo.items,
      global.currencyPriceList,
      true
    )

    setOrderDetail(orderInfo)
    setTransactionData(transaction)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  }

  const getTransactionLink = (transactionHash='') => {
    return network === 'kovan'
            ? `https://kovan.etherscan.io/tx/${transactionHash}`
            :   `https://etherscan.io/tx/${transactionHash}`
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }

    if (!global.currencyPriceList.length) {
      loadCurrencyPrices(dispatch)
      return
    }

    if (!(transactionData || {}).extraData) {
      loadOrder()
    } else {
      if (!global.klerosEscrowInstance) {
        setKlerosInstance({ ...transactionData }, dispatch)
      }
      return
    }
  }, [transactionId, transactionData, global.currencyPriceList])

  useEffect(() => {
    const checkAndUpdateDisputeStatus = async () => {
      const disputeId = (orderDetail.transaction || {}).disputeId;
      if (disputeId) {
        const disputeStatus = await global.arbitratorInstance.disputeStatus(disputeId);
        const disputeStatusParsed = translateStatusIdToNamingInTransaction(disputeStatus);
  
        if (orderDetail.status !== disputeStatusParsed) {
          const transactionId = (orderDetail.transaction || {}).transactionHash;
          await orderService.updateOrderStatus(transactionId, disputeStatusParsed);
        }
      }
    }

    if (!global.arbitratorInstance) {
      setArbitratorInstance(getCurrentWallet(true), dispatch)
      return;
    } else {
      checkAndUpdateDisputeStatus();
    }
  }, [global.arbitratorInstance, orderDetail])

  return (
    <Container
      padding="2rem 0"
      height={'calc(100vh - 180px)'}
      position={'relative'}
    >
      {operationInProgress && <Loading styleType={'checkout'} />}
      <Heading marginBottom="2rem">OrderDetail</Heading>
      <Box>
        <Text marginBottom="1rem">Order id: {orderDetail._id}</Text>
        <Box>
          <Text marginBottom="1rem">Items:</Text>
          {(orderDetail.items || []).map((item, index) => (
            <Box padding="1rem" key={`order-item-${index}`}>
              <Text>{item.name}</Text>
              <Text>Price: {item.price || 0}</Text>
              {item.currencySymbolPrice || 'ETH'}
            </Box>
          ))}
        </Box>
        <Text marginBottom="1rem">Transaction hash: </Text>
        <Link target='_blank'
              href={getTransactionLink((orderDetail.transaction || {}).transactionHash)}>
          <Text color='#00abd1' cursor='pointer' wordBreak={'break-all'}>
            {getTransactionLink((orderDetail.transaction || {}).transactionHash)}
          </Text>
        </Link>
      </Box>
      <Box marginTop={'24px'}>
        <Box margin={'2rem 0'}>
          <Text>Chat</Text>
          <Button bg="#00abd1" color={'white'} onClick={redirectToChat}>
            Chat with seller
          </Button>
        </Box>
        {(orderDetail.transaction || {}).transactionIndex &&
          orderDetail.status === 'ORDER_CREATED' && (
          <Flex marginTop="auto" justifyContent="space-around">
            {transactionData && transactionData.amount && (
              <ButtonPayOrder
                transactionIndex={
                  (orderDetail.transaction || {}).transactionIndex
                }
                transactionHash={
                  (orderDetail.transaction || {}).transactionHash
                }
                amount={(transactionData.amount || {}).value || 0}
                stepsPostAction={loadOrder}
                toggleLoadingStatus={toggleLoadingStatus}
              />
            )}
            <ButtonEscrowDispute
              transactionIndex={
                (orderDetail.transaction || {}).transactionIndex
              }
              transactionHash={(orderDetail.transaction || {}).transactionHash}
              amount={minimumArbitrationFeeUSD}
              stepsPostAction={loadOrder}
              toggleLoadingStatus={toggleLoadingStatus}
            />
          </Flex>
        )}
        {transactionData && orderDetail.status === 'ORDER_PAID' && (
          <p>Order paid</p>
        )}
        {transactionData &&
          orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
            <p>
              Dispute pending to start, waiting for seller to pay the arbitration
              fee.
            </p>
          )}
        {transactionData &&
          orderDetail.status === 'ORDER_DISPUTE_IN_PROGRESS' && (
            <p>Dispute in progress.</p>
          )}
      </Box>
    </Container>
  )
}

export default OrderDetail
