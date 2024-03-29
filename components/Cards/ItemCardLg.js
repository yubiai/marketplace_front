import {
  Box,
  Text,
  Stack,
  Image,
  Divider,
  Badge,
} from '@chakra-ui/react'
import Link from 'next/link'

const ItemCardLg = ({ item }) => {
  return (
    <Box p={2} cursor="pointer">
      <Link href={`/item/${item.slug}`}>
        <Box
          role={'group'}
          maxW={{ base: '330px', sm: '374px', md: '262px' }}
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
          {/* {item.seller && (
            <Box position={"absolute"} ml="3px">
              <Badge colorScheme='blue' fontSize={"10px"}
              >{item.seller.name}</Badge>
            </Box>
          )} */}
          <Image
            alt="Img Item"
            borderTopRadius="lg"
            height={'280px'}
            width={{ base: '374px', sm: '374px', md: '262px' }}
            objectFit={'cover'}
            src={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_FLEEK + item.files[0].filename : '/static/images/ybminilogo.png'}
            fallbackSrc={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_GC + item.files[0].filename : '/static/images/ybminilogo.png'}
          />
          <Stack align={'left'} m="5px">
            <Divider />
            <Text
              color={'gray.600'}
              fontSize={'0.9em'}
              noOfLines={2}
            >
              {item.title}
            </Text>
            {item.seller && (
              <Box position="absolute" bottom="5" left="0.5">
                <Badge color={"blue.800"} bg="white" fontSize={"10px"} noOfLines={2}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >{item.seller.name}</Badge>
              </Box>
            )}
            <Stack direction={'row'} position="absolute" bottom="0" left="1">
              <Text fontWeight={800} fontSize={'1ems'} ml="2px">
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
    </Box>
  )
}

export default ItemCardLg
