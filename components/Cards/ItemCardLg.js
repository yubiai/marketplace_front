import {
  Box,
  Center,
  Text,
  Stack,
  Image,
  Divider,
} from '@chakra-ui/react'
import Link from 'next/link'

const ItemCardLg = ({ item }) => {
  return (
    <Center p={2} cursor="pointer">
      <Link href={`/item/${item.slug}`}>
        <Box
          role={'group'}
          maxW={'262px'}
          w={'full'}
          maxH={'400px'}
          h={'378px'}
          bg={'white'}
          rounded={'lg'}
          pos={'relative'}
          _hover={{
            bg: 'gray.300',
          }}
        >
          <Image
            alt="Img Item"
            borderTopRadius="lg"
            height={'280px'}
            width={'262px'}
            objectFit={'cover'}
            src={item.pictures[0]}
          />
          <Stack align={'left'} m="5px">
            <Divider />
            <Text
              color={'gray.600'}
              fontSize={'16px'}
              textTransform={'uppercase'}
            >
              {item.title}
            </Text>
            <Stack direction={'row'} position="absolute" bottom="1">
              <Text fontWeight={800} fontSize={'1ems'}>
                {item.price}
              </Text>
              <Text>DAI</Text>
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

export default ItemCardLg
