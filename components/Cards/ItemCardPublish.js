import {
  Box,
  Text,
  Stack,
  Image,
  Divider,
  Badge,
  Spinner
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react';
import ButtonAdmItem from '../Buttons/ButtonAdmItem'

const ItemCardPublish = ({ item, token, mutate, t }) => {
  const [loading, setLoading] = useState(false);
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
          <Image
            alt="Img Item"
            borderTopRadius="lg"
            height={'280px'}
            width={{base: '374px', sm: '374px', md: '262px'}}
            objectFit={'cover'}
            src={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_FLEEK + item.files[0].filename : '/static/images/ybminilogo.png'}
            fallbackSrc={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_GC + item.files[0].filename : '/static/images/ybminilogo.png'}
          />

          <Box position={"absolute"} top="0" m="1px">
            {loading ? (
              <>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
                />
              </>
            ) : (
              <>
                <Badge variant='solid' colorScheme={item.published ? "green" : "red"}>{item.published ? t("Published") : t("Not published")}</Badge>
                {item.status === 1 && (
                  <Badge variant='solid' colorScheme="orange" ml="4px">{t("In Review")}</Badge>
                )}
              </>
            )}
          </Box>
          <Stack align={'left'} m="5px">
            <Divider />
            <Text
              color={'gray.600'}
              fontSize={'16px'}
              noOfLines={2}
            >
              {item.title}
            </Text>
            <Stack direction={'row'} position="absolute" bottom="1">
              {item && item.typeprice && item.typeprice != "To settle" && (
                <>
                <Text fontWeight={800} fontSize={'1ems'}>
                {item.price}
              </Text>
              <Text>{item.currencySymbolPrice}</Text> 
                </>
              )}
              <Text fontSize={"sm"}>({t(`${item.typeprice}`)})</Text>
              {/* <Text textDecoration={'line-through'} color={'red'}>
              $199
            </Text> */}
            </Stack>
          </Stack>
        </Box>
      </Link>
      <ButtonAdmItem item={item} token={token} mutate={mutate} loading={loading} setLoading={setLoading} t={t} />
    </Box>
  )
}

export default ItemCardPublish
