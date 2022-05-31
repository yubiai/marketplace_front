import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react'
// import { FaBeer } from 'react-icons/fa';
import { MdOutlineStar, MdStarOutline, MdStar } from 'react-icons/md'
import axios from 'axios'
import { useEffect, useState } from 'react'
import InfoUserModal from '../../components/Modals/InfoUserModal'
import Loading from '../../components/Spinners/Loading'
import Head from 'next/head'
import { useGlobal } from '../../providers/globalProvider'
import { profileService } from '../../services/profileService'

const ItemById = ({ item }) => {
  const global = useGlobal()
  const toast = useToast()

  const [owner, setOwner] = useState(false)
  const [favorite, setFavorite] = useState(false)

  const [selectImage, setSelectImage] = useState(null)

  const actionToat = (title, description, status) => {

    toast({
      title,
      description: description,
      position: 'top-right',
      status: status,
      duration: 5000,
      isClosable: true
    })
  }

  const getFavorites = async () => {
    console.log('Get Favorites')
    let favorites
    await profileService
      .getFavorites((global && global.profile && global.profile._id) || null)
      .then((res) => {
        favorites = res.data || []
        if (favorites.length > 0) {
          for (let i = 0; i < favorites.length; i++) {
            if (favorites[i]._id === item._id) {
              console.log('es favorito')
              setFavorite(true)
              break;
            } else {
              setFavorite(false);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addFavorite = async () => {
    console.log('add Favorite')
    await profileService
      .addFavorite(
        (global && global.profile && global.profile._id) || null,
        item || null
      )
      .then((res) => {
        if (res.status === 200) {
          getFavorites();
          actionToat("Favorites", "Item added to favorites successfully.", "success")
          return
        }
      })
  }

  const removeFavorite = async () => {
    console.log('Remove Favorite')
    await profileService
      .removeFavorite(
        (global && global.profile && global.profile._id) || null,
        item || null
      )
      .then((res) => {
        if (res.status === 200) {
          getFavorites()
          actionToat("Favorites", "Item removed from favorites successfully.", "info")
          return
        }
      })
  }

  useEffect(() => {
    console.log(item, 'item')
    console.log(global.profile)
    const funcSelectImage = () => {
      if (item && item.pictures && item.pictures.length > 0) {
        setSelectImage(item.pictures[0])
      }
    }
    const InitProfile = () => {
      if (item && item.seller && item.seller._id === global.profile._id) {
        setOwner(true)
      } else {
        getFavorites()
      }
    }
    funcSelectImage()
    InitProfile()
  }, [item])

  if (!item) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - {item.title}</title>
      </Head>
      <Container maxW="6xl" h={{base: "full", sm: "full", md: "full", lg: "full", xl: "100vh"}} display={'flex'} flexDirection={'column'}>
        <Flex width={'full'} direction={{ base: 'column', md: 'row' }} mt="1em">
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
            <Flex justifyContent={'space-between'}>
              <Text color="#323232" fontSize="14px" fontWeight="300">
                New
              </Text>
              {!owner && (
                <Box>
                  {!favorite && (
                    <Button onClick={() => addFavorite()}>
                      <MdStarOutline color="00abd1" />
                    </Button>
                  )}
                  {favorite && (
                    <Button onClick={() => removeFavorite()}>
                      <MdStar color="00abd1" />
                    </Button>
                  )}
                </Box>
              )}
            </Flex>
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
            <Flex
              direction={{ base: 'column' }}
              justifyContent="center"
              w="full"
              h="300px"
            >
              <Center>
                <Button
                  bg="#00abd1"
                  color="white"
                  w="312px"
                  h="32px"
                  fontSize={'16px'}
                  fontWeight={'600'}
                  disabled={owner}
                >
                  Buy Now
                </Button>
              </Center>
              <Center>
                {owner && <Text color="red.300">It is your publication</Text>}
              </Center>
            </Flex>
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

export async function getStaticPaths() {
  const paths = []
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  try {
    const { slug } = params
    const res = await axios.get(`/items/item/${slug}`)
    const item = res.data.result

    return { props: { item } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}

export default ItemById
