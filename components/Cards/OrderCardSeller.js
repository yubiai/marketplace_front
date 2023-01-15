import React, { useEffect, useState } from 'react';
import { Stack, Text, Button, Divider, SimpleGrid, Box, Image, Center } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { StatusOrderByStateShort } from '../Infos/StatusOrder';

const OrderCardSeller = ({ order, yubiaiPaymentInstance }) => {
  const router = useRouter();
  const [deal, setDeal] = useState(null);
  useEffect(() => {
    const setDealInfo = async _order => {
      const fullStatus = await yubiaiPaymentInstance.getFullStatusOfDeal(_order.transaction.transactionIndex);
      setDeal(fullStatus);
    }

    if (!deal && yubiaiPaymentInstance) {
      setDealInfo(order);
    }
  }, [deal, yubiaiPaymentInstance]);

  return (
    <Stack p="4" boxShadow="lg" m="0.5px" borderRadius="lg" bg="white">

      <Stack direction={{ base: "column", md: "row" }} alignItems="left">
        <Text fontWeight="semibold">
          {order.createdAt
            ? moment(order?.createdAt).format('DD MMMM, YYYY h:mm:ss a')
            : moment(order?.dateOrder).format('DD MMMM, YYYY h:mm:ss a')}</Text>
        {(deal || {}).dealStatus && StatusOrderByStateShort(
          deal.dealStatus,
          deal.claimStatus,
          deal.claimCount,
          deal.disputeId
        )}
      </Stack>
      <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
      <SimpleGrid columns={{ base: '1', sm: '1', md: '2', lg: '3' }} spacing={5} color="black">
        <Center>
          <Box maxW={"90px"} mt="0.7em">
            <Link href={'/item/' + order?.itemId.slug}>
              <Image
                borderRadius='full'
                boxSize='90px'
                objectFit='cover'
                src={order && order.itemId.files && order.itemId.files[0] && process.env.NEXT_PUBLIC_LINK_FLEEK + order.itemId.files[0].filename}
                fallbackSrc={order && order.itemId.files && order.itemId.files[0] && process.env.NEXT_PUBLIC_LINK_GC + order.itemId.files[0].filename}
                alt='Image item the order'
              /></Link>

          </Box>
        </Center>
        <Center noOfLines={3} mt="1em">
          <Box textAlign={"center"} p="5px">
            <Link href={'/item/' + order?.itemId.slug}>
              <Text align={"center"} cursor={'pointer'}
                fontWeight={600} _hover={{ textDecoration: "underline" }}>{order.itemId.title}</Text>
            </Link>

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
                router.push('/profile/orders/as-seller/' + order?.transactionHash)
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

export default OrderCardSeller
