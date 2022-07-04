import { Stack, Text, Button } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { FcLock } from 'react-icons/fc'

const OrderCardSeller = ({ order }) => {
  const router = useRouter()

  return (
    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" bg="white">
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">Order</Text>
        <FcLock />
        <Text>{order?.status}</Text>
      </Stack>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
      >
        <Text
          fontSize={{ base: 'sm' }}
          maxW={'4xl'}
          cursor={'pointer'}
          _hover={{ color: 'gray.600' }}
        >
          ID Order: {order?._id}
        </Text>
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          Date:{' '}
          {order.createdAt
            ? moment(order?.createdAt).format('MM/DD/YYYY')
            : moment(order?.dateOrder).format('MM/DD/YYYY')}
        </Text>
        <Text
          fontSize={{ base: 'sm' }}
          maxW={'4xl'}
          cursor={'pointer'}
          _hover={{ color: 'gray.600' }}
        >
          ID Item: {order?.itemId}
        </Text>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <Text fontSize={{ base: 'sm' }} maxW={'4xl'}>
          Buyer: {order?.userBuyer} -
        </Text>
        <Text fontSize={{ base: 'sm' }} maxW={'4xl'}>
          Seller: {order?.userSeller}
        </Text>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <Button
          backgroundColor={'#00abd1'}
          color={'white'}
          rounded={'full'}
          cursor={'pointer'}
          onClick={() =>
            router.push('/profile/orders/as-seller/' + order?.transactionHash)
          }
        >
          Detail
        </Button>
      </Stack>
    </Stack>
  )
}

export default OrderCardSeller
