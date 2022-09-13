import { Stack, Text, Button, Divider, SimpleGrid, Box, Image, Center } from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'

const OrderCardBuyer = ({ order }) => {
  console.log(order)
  const router = useRouter()

  return (
    <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" bg="white">

      <Stack direction={{ base: "column", md: "row" }} alignItems="left">
        <Text fontWeight="semibold">
          {order.createdAt
            ? moment(order?.createdAt).format('DD MMMM, YYYY h:mm:ss a')
            : moment(order?.dateOrder).format('DD MMMM, YYYY h:mm:ss a')}</Text>

      </Stack>
      <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
      <SimpleGrid columns={{ base: '1', sm: '1', md: '2', lg: '3', xl: '4' }} spacing={5} color="black">
        <Center>
          <Box maxW={"90px"} mt="0.7em">
            <Link href={'/item/' + order?.itemId.slug}>
              <Image
                borderRadius='full'
                boxSize='90px'
                src={order && order.itemId.files && order.itemId.files[0] && process.env.NEXT_PUBLIC_LINK_FLEEK + order.itemId.files[0].filename}
                fallbackSrc={order && order.itemId.files && order.itemId.files[0] && process.env.NEXT_PUBLIC_LINK_GC + order.itemId.files[0].filename}
                alt='Image item the order'
              /></Link>

          </Box>
        </Center>
        <Center>
          <Box textAlign={"center"}>
            <Text>{order.status}</Text>
            <Link href={'/item/' + order?.itemId.slug}><Text cursor={'pointer'} fontWeight={600} _hover={{
              textDecoration: "underline"
            }}
            >{order.itemId.title}</Text></Link>
          </Box>
        </Center>
        <Center>
          <Box>
            <Text>Seller: {order.itemId.seller.first_name} {order.itemId.seller.last_name}</Text>
          </Box>
        </Center>
        <Center>
          <Box>
            <Button
              backgroundColor={'#00abd1'}
              color={'white'}
              rounded={'full'}
              cursor={'pointer'}
              _hover={{
                bg: "gray.400"
              }}
              onClick={() =>
                router.push('/profile/orders/detail/' + order?.transactionHash)
              }
            >
              View Order
            </Button>
          </Box>
        </Center>
      </SimpleGrid>

    </Stack>
  )
}

export default OrderCardBuyer
