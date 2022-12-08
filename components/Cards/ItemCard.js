import { Box, Center, Text, Stack, Image, Divider, Badge } from '@chakra-ui/react'
import Link from 'next/link'

const ItemCard = ({ item }) => {
  return (
    <Center p={1} cursor="pointer">
      <Link href={`/item/${item.slug}`}>
        <Box
          role={'group'}
          p={2}
          maxW={'180px'}
          w={'full'}
          maxH={'260px'}
          h={'260px'}
          bg={'white'}
          rounded={'lg'}
          pos={'relative'}
          _hover={{
            bg: 'gray.300',
          }}
        >
          {item.seller && (
            <Box position={"absolute"} ml="3px">
              <Badge colorScheme='blue' fontSize={"10px"}
              >{item.seller.first_name} {item.seller.last_name}</Badge>
            </Box>
          )}
          <Image
            alt="Img Item"
            rounded={'lg'}
            height={'150px'}
            width={'180px'}
            objectFit={'cover'}
            src={item && item.files && item.files.length && item.files[0] && item.files[0].filename ? process.env.NEXT_PUBLIC_LINK_FLEEK + item.files[0].filename : '/static/images/ybminilogo.png'}
            fallbackSrc={item && item.files && item.files.length && item.files[0] && item.files[0].filename ? process.env.NEXT_PUBLIC_LINK_GC + item.files[0].filename : '/static/images/ybminilogo.png'}
          />
          <Stack align={'left'} mt="2px">
            <Divider />
            <Text
              color={'gray.600'}
              fontSize={'0.9em'}
              noOfLines={2}
              maxH="70px"
            >
              {item.title}
            </Text>
            <Stack direction={'row'} position="absolute" bottom="1">
              <Text fontWeight={800} fontSize={'1ems'}>
                {item.price}
              </Text>
              <Text>{item.currencySymbolPrice}</Text>
              {/* <Text textDecoration={'line-through'} color={'red'}>
              $199
            </Text> */}
            </Stack>
          </Stack>
        </Box>
      </Link>
    </Center>
  )
}

export default ItemCard
