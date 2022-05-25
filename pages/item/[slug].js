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
// import { FaBeer } from 'react-icons/fa';
import { MdOutlineStar } from 'react-icons/md'
import axios from 'axios'
import { useEffect, useState } from 'react'
import InfoUserModal from '../../components/Modals/InfoUserModal'

const ItemById = ({ item }) => {
  const [selectImage, setSelectImage] = useState(null)
  console.log(item, "item")
  useEffect(() => {
    const funcSelectImage = () => {
      if (item && item.pictures && item.pictures.length > 0) {
        setSelectImage(item.pictures[0])
      }
    }
    funcSelectImage()
  }, [item]);

  return (
    <>
      <Container maxW="container.xl">
        <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
          <Box width={{ base: '100%', md: '66%' }} m="5px">
            <Box padding="5px">
              {selectImage && (
                <Center>
                  <Image
                    alt="Img Item"
                    rounded={'lg'}
                    height={'600px'}
                    width={'full'}
                    objectFit={'cover'}
                    src={selectImage}
                  />
                </Center>
              )}
            </Box>
            <Box>
              <Divider />
              <Box>
                <Flex justifyContent={'center'}>
                  {item &&
                    item.pictures &&
                    item.pictures.length > 0 &&
                    item.pictures.map((image, i) => {
                      if (image) {
                        return (
                          <Center m="0.5em" key={i}>
                            <Image
                              alt="Img Item"
                              rounded={'lg'}
                              height={'70px'}
                              width={'100px'}
                              cursor="pointer"
                              objectFit={'cover'}
                              src={image}
                              onClick={() => setSelectImage(image)}
                            />
                          </Center>
                        )
                      }
                    })}
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
            <InfoUserModal user={item.seller} />
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
          <Text mt="10px">{item.description}</Text>
        </Box>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const { slug } = context.query
    const res = await axios.get(`/items/item/${slug}`)
    const item = res.data.result

    return { props: { item } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}

export default ItemById
