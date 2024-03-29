import { Box, Center, Text, Stack, Image, Divider, Badge } from '@chakra-ui/react'
import Link from 'next/link'

const ItemCard = ({ item }) => {
  return (
    <Center p={1} cursor="pointer">
      <Link href={`/item/${item.slug}`}>
        <Box
          role={'group'}
          p={2}
          w={{ base: '140px', sm: "150px", md: "160px", lg: "180px" }}
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
            src={item && item.files && item.files.length && item.files[0] && item.files[0].filename ? process.env.NEXT_PUBLIC_LINK_FLEEK + item.files[0].filename : '/static/images/ybminilogo.png'}
            fallbackSrc={item && item.files && item.files.length && item.files[0] && item.files[0].filename ? process.env.NEXT_PUBLIC_LINK_GC + item.files[0].filename : '/static/images/ybminilogo.png'}
          />

          <Stack align={'left'}>
            <Divider />
            <Text
              color={'gray.600'}
              fontSize={'0.9em'}
              noOfLines={2}
              maxH="60px"
            >
              {item.title}
            </Text>
            {item.seller && (
              <Box position="absolute" bottom="5" left="1" >
                <Badge color={"blue.800"} bg="white" fontSize={{base: "8px", md: "10px"}} mr={"3px"} noOfLines={2}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >{item.seller.name}</Badge>
              </Box>
            )}
            <Stack direction={'row'} position="absolute" bottom="0">
              <Text fontWeight={800} fontSize={'1ems'} >
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
