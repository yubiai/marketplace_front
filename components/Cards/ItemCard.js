import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  Divider,
} from '@chakra-ui/react'
import Link from 'next/link'

const IMAGE =
  'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80'

const ItemCard = ({item}) => {
  return (
    <Center p={1} cursor="pointer">
      <Link href={`/item/${item.slug}`} >
        <Box
          role={'group'}
          p={2}
          maxW={'155px'}
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
              fontSize={'0.7em'}
              textTransform={'uppercase'}
            >
              {item.title}
            </Text>
            <Stack direction={'row'}>
              <Text fontWeight={800} fontSize={'1ems'}>
                100
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

export default ItemCard
