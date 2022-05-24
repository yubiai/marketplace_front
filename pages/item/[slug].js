import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react'
import ItemCard from '../../components/Cards/ItemCard'
// import { FaBeer } from 'react-icons/fa';
import { MdOutlineStar } from 'react-icons/md'
import axios from 'axios'

const ItemById = ({ item }) => {
  console.log(item)

  return (
    <>
      <Container maxW="container.xl">
        <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
          <Box width={{ base: '100%', md: '66%' }} m="5px">
            <Box padding="5px">
              <Center>
                <Image
                  alt="Img Item"
                  rounded={'lg'}
                  height={'600px'}
                  width={'full'}
                  objectFit={'cover'}
                  src={item.pictures[0]}
                />
              </Center>
            </Box>
            <Box>
              <Divider />
              <Box>
                <Flex>
                 card
                </Flex>
              </Box>
            </Box>
          </Box>
          <Box
            padding="5px"
            m="5px"
            width={{ base: '100%', md: '33%' }}
            h="546px"
            border={'solid 1px #bababa;'}
            borderRadius={'5px'}
          >
            <Text color="#323232" fontSize="14px" fontWeight="300">
              New
            </Text>
            <Text fontSize="20px" fontWeight="600">
              {item.title}
            </Text>
            <Text color="#01abd0" fontSize="14px" fontWeight="600">
              Sell by Englego
            </Text>
            <Box
              display={'flex'}
              flexDirection={'row'}
              mt="5px"
              alignItems={'center'}
            >
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <Text color="#323232" fontSize="14px" fontWeight="300">
                3 Opinions
              </Text>
            </Box>
            <Text>{item.price} DAIs</Text>
            <Text>0% addtional for Yubiai Fee</Text>
            <Text>0.6% additional for UBI Burner Fee</Text>
            <Box
              display={'flex'}
              h="-webkit-fill-available"
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Button
                bg="#00abd1"
                color="white"
                w="312px"
                h="32px"
                fontSize={'16px'}
                fontWeight={'600'}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Flex>
        <Divider />
        <Box m="1em">
          <Text mt="10px">Course description</Text>
          <Text mt="10px">
            {item.description}
          </Text>
        </Box>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const { slug } = context.query;
    const res = await axios.get(`/items/item/${slug}`);
    const item = res.data.result[0]

    return { props: { item } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}

export default ItemById
