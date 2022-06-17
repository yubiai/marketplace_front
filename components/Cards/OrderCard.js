import { Stack, Text, Button } from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FcLock } from 'react-icons/fc'

const OrderCard = ({ order }) => {
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
        <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
          Date:{' '}
          {order.createdAt
            ? moment(order?.createdAt).format('MM/DD/YYYY')
            : moment(order?.dateOrder).format('MM/DD/YYYY')}
        </Text>
        <Link href={`/item/${order?.items[0]?.slug}`}>
          <Text
            fontSize={{ base: 'sm' }}
            maxW={'4xl'}
            cursor={'pointer'}
            _hover={{ color: 'gray.600' }}
          >
            Item: {order?.items[0]?.title}
          </Text>
        </Link>
        <Stack direction={{ base: 'column', md: 'row' }}>
          <Button
            backgroundColor={'#00abd1'}
            color={'white'}
            rounded={'full'}
            ml="1em"
            cursor={'pointer'}
            display={{ base: 'none', md: 'flex' }}
            onClick={() =>
              router.push('/profile/orders/detail/' + order?.transactionHash)
            }
          >
            Detail
          </Button>
        </Stack>
      </Stack>
      <Text fontSize={{ base: 'sm' }} maxW={'4xl'}>
        Seller: {order?.items[0]?.seller?.first_name}{' '}
        {order?.items[0]?.seller?.last_name} (Wallet:{' '}
        {order?.items[0]?.seller?.eth_address})
      </Text>
    </Stack>
  )
}

export default OrderCard
