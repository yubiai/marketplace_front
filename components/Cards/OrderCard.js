import { Stack, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FcLock } from 'react-icons/fc'

const OrderCard = ({ order }) => {
  const router = useRouter()
  console.log(order)

  return (
    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm">
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">Order</Text>
        <FcLock />
        <Text>{order.status}</Text>
      </Stack>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
      >
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          Date: {order.dateOrder}
        </Text>
        <Text fontSize={{ base: 'sm' }} maxW={'4xl'}>
          Item: <Link href={`/item/${order.items[0].slug}`}>{order.items[0].title}</Link>
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }}>
          <Button
            backgroundColor={'#00abd1'}
            color={'white'}
            rounded={'full'}
            ml="1em"
            cursor={'pointer'}
            display={{ base: 'none', md: 'flex' }}
            onClick={() => router.push('/profile/orders/detail/' + order.transactionHash)}
          >
            Detail
          </Button>
        </Stack>
      </Stack>
      <Text fontSize={{ base: 'sm' }} maxW={'4xl'}>
          Seller: {order.items[0].seller.first_name} {order.items[0].seller.last_name} (Wallet: {order.items[0].seller.eth_address}) 
        </Text>
    </Stack>
  )
}

export default OrderCard
