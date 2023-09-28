import React, { useState } from 'react';
import { Stack, Text, Button, Divider, SimpleGrid, Box, Image, Center, Spinner } from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StatusOrderByStateShort } from '../Infos/StatusOrder'
import { useContractReads } from 'wagmi';
import { getFullStatusOfDealClaim } from '../../utils/orderUtils';

const OrderCardBuyer = ({ yubiaiContract, abiYubiai, order, network, t }) => {
  const router = useRouter();
  const [deal, setDeal] = useState({ deal: {}, claim: {} });

  const { isLoading } = useContractReads({
    contracts: [
      {
        address: yubiaiContract,
        abi: abiYubiai,
        functionName: 'deals',
        args: [order.transaction.transactionIndex],
      },
      {
        address: yubiaiContract,
        abi: abiYubiai,
        functionName: 'claims',
        args: [order.transaction.currentClaim],
      },
      {
        address: yubiaiContract,
        abi: abiYubiai,
        functionName: 'isOver',
        args: [order.transaction.transactionIndex],
      },
      {
        address: yubiaiContract,
        abi: abiYubiai,
        functionName: 'settings'
      },
    ],
    async onSuccess(data) {
      const result = await getFullStatusOfDealClaim(data, order.transaction.transactionIndex);
      setDeal(result);
    }
  })

  return (
    <Stack p="4" boxShadow="lg" m="0.5px" borderRadius="lg" bg="white">

      <Stack direction={{ base: "column", md: "row" }} alignItems="left">
        <Text fontWeight="semibold">
          {order.createdAt
            ? moment(order?.createdAt).format('DD MMMM, YYYY h:mm:ss a')
            : moment(order?.dateOrder).format('DD MMMM, YYYY h:mm:ss a')}</Text>

        {isLoading && <Spinner />}

        {order?.status != "ORDER_REFUNDED" && (
          <>
            {(deal || {}).deal.dealStatus && StatusOrderByStateShort(
              deal.deal,
              deal.claim,
              t
            )}
          </>
        )}

        {order?.status == "ORDER_CREATED" && order?.orderCompletedBySeller && (<>
          <Box bg="orange.400" rounded={"5px"}>
            <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Work has been notified as completed")}</Text>
          </Box>
        </>)
        }

        {
          order?.status == "ORDER_REFUNDED" && (
            <>
              <Box bg="red.700" rounded={"5px"}>
                <Text color="white" fontSize={"larger"} fontStyle="normal" pl="15px" pr="15px">{t("Order Refunded")}</Text>
              </Box>
            </>
          )
        }

        <Box bg="green.700" rounded={"5px"}>
          <Text color="white" fontStyle="italic" pl="15px" pr="15px">{order?.transaction.networkEnv.toUpperCase()}</Text>
        </Box>
      </Stack>
      <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
      <SimpleGrid columns={{ base: '1', sm: '1', md: '2', lg: '3', xl: '4' }} spacing={5} color="black">
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
            <Link href={'/item/' + order?.itemId.slug}><Text cursor={'pointer'}
              fontWeight={600} _hover={{
                textDecoration: "underline"
              }}
            >{order.itemId.title}</Text></Link>
          </Box>
        </Center>
        <Center>
          <Box display={"flex"} w="80%">
            <Text fontWeight={600}>{t("Seller")}</Text>
            <Text ml="2px" noOfLines={2}>{order.itemId.seller.name} </Text>
          </Box>
        </Center>
        <Center>
          <Box>
            <Button
              backgroundColor={'#00abd1'}
              color={'white'}
              cursor={'pointer'}
              isDisabled={order?.transaction.networkEnv != network}
              _hover={{
                bg: "gray.400"
              }}
              onClick={() =>
                router.push('/profile/orders/detail/' + order?.transactionHash)
              }
            >
              {t("View Order")}
            </Button>
            {order?.transaction.networkEnv != network && (
              <Center>
                <Text textColor={"red.500"} fontSize={"0.8em"}>Error Network</Text>
              </Center>
            )}
          </Box>
        </Center>
      </SimpleGrid>

    </Stack>
  )
}

export default OrderCardBuyer
