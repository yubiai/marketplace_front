import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Text,
  Stack,
  Image,
  Divider,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react'
import Link from 'next/link'

const ItemCardPublish = ({ item }) => {

  return (
    <Box p={2} cursor="pointer">
      <Link href={`/item/${item.slug}`}>
        <Box
          role={'group'}
          maxW={{ base: '374px', sm: '374px', md: '262px' }}
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
            width={{ base: '374px', sm: '374px', md: '262px' }}
            objectFit={'cover'}
            src={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_FLEEK + item.files[0].filename : '/static/images/ybminilogo.png'}
            fallbackSrc={item && item.files && item.files[0] ? process.env.NEXT_PUBLIC_LINK_GC + item.files[0].filename : '/static/images/ybminilogo.png'}
          />

          <Box position={"absolute"} top="0" m="1px">
            <Badge variant='solid' colorScheme={item.published ? "green" : "red"}>{item.published ? "Published" : "Not published"}</Badge>
            {item.status === 1 && (
              <Badge variant='solid' colorScheme="orange" ml="4px">In Review</Badge>
            )}
            <Box textAlign={"right"}>

            </Box>
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
      <Menu>
        <MenuButton as={Button} w={{ base: '374px', sm: '374px', md: '262px' }} backgroundColor={'#00abd1'} _hover={{
          bg: "blue.300"
        }}
          color={'white'} rightIcon={<ChevronDownIcon />}>
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>Unpublish</MenuItem>
          <MenuItem>Publish</MenuItem>
          <MenuItem>Edit</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}

export default ItemCardPublish
