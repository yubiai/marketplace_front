import { Box, Center, Text, Stack, Image, Divider } from '@chakra-ui/react'
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
          <Image
            alt="Img Item"
            rounded={'lg'}
            height={'150px'}
            width={'180px'}
            objectFit={'cover'}
            src={item.pictures[0]}
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
              <Text>{item.currencySymbolPrice || 'ETH'}</Text>
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
