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
import { MdStarOutline, MdStar } from 'react-icons/md'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import InfoUserModal from '../../components/Modals/InfoUserModal'
import { useDispatchGlobal } from '../../providers/globalProvider'
import Loading from '../../components/Spinners/Loading'
import Head from 'next/head'
import { useGlobal } from '../../providers/globalProvider'
import { profileService } from '../../services/profileService'
import { log } from 'next-axiom';
import useUser from '../../hooks/data/useUser'
import ImagePreviewListingCard from '../../components/Cards/ImagePreviewListingCard'
import PlayerVideo from '../../components/Utils/PlayerVideo'
import PlayerAudio from '../../components/Utils/PlayerAudio'

const ItemById = ({ item }) => {
  const global = useGlobal();
  const toast = useToast();

  const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  const [owner, setOwner] = useState(null);
  const [favorite, setFavorite] = useState(null);

  const [selectFile, setSelectFile] = useState(null);

  const router = useRouter();
  const dispatch = useDispatchGlobal();

  const { user } = useUser();

  const actionToat = (title, description, status) => {
    toast({
      title,
      description: description,
      position: 'top-right',
      status: status,
      duration: 5000,
      isClosable: true,
    })
  }

  const getFavourites = async () => {
    let favourites
    setOwner(false)
    await profileService
      .getFavourites((global && global.profile && global.profile._id) || null, null, global?.profile?.token)
      .then((res) => {
        favourites = res.data.items || []
        if (favourites.length > 0) {
          for (let i = 0; i < favourites.length; i++) {
            if (favourites[i]._id === item._id) {
              setFavorite(true)
              break
            } else {
              setFavorite(false)
            }
          }
        }
        if (favourites.length === 0) {
          setFavorite(false)
        }
      })
      .catch(() => {
        setFavorite(false)
      })
  }

  const addFavorite = async () => {
    log.info('Add Favorite axion')
    await profileService
      .addFavorite(
        (global && global.profile && global.profile._id) || null,
        item || null, global?.profile?.token
      )
      .then((res) => {
        if (res.status === 200) {
          getFavourites()
          actionToat(
            'Favourites',
            'Item added to favourites successfully.',
            'success'
          )
          return
        }
      })
  }

  const removeFavorite = async () => {
    await profileService
      .removeFavorite(
        (global && global.profile && global.profile._id) || null,
        item || null, global?.profile?.token
      )
      .then((res) => {
        if (res.status === 200) {
          getFavourites()
          actionToat(
            'Favourites',
            'Item removed from favourites successfully.',
            'info'
          )
          return
        }
      })
  }

  const funcSelectImage = () => {
    if (item && item.files) {
      setSelectFile(item.files[0])
    }
  }

  const funcFavourites = () => {
    if (item && item.seller && item.seller._id === global.profile._id) {
      setOwner(true)
    } else {
      getFavourites()
    }
  }

  useEffect(() => {
    if (item) {
      funcSelectImage()
    }
    if (global && global.profile && item && item._id) {
      funcFavourites()
    } else {
      setOwner(null)
    }

    if (!global.klerosEscrowInstance) {
      return;
    } else {
      dispatch({
        type: 'SET_KLEROS_ESCROW_INSTANCE',
        payload: null,
      })
    }
  }, [item, global])

  const buyAndCheckoutItem = () => {
    dispatch({
      type: 'SET_ITEM_TO_CHECKOUT',
      payload: item,
    })
    router.push('/checkout')
  }

  if (!item) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - {item.title}</title>
      </Head>
      <Container
        maxW="6xl"
        h={"full"}
        display={'flex'}
        flexDirection={'column'}
      >
        <Flex width={'full'} direction={{ base: 'column', md: 'row' }} mt="1em">
          <Box width={{ base: '100%', md: '66%' }} height={'full'} m="5px">
            <Box padding="5px" height={'85%'}>
              {selectFile && selectFile.mimetype === "image/webp" && (
                <Center>
                  <Image
                    alt="Img Item"
                    rounded={'lg'}
                    width={'full'}
                    objectFit={'cover'}
                    src={url_fleek + selectFile.filename}
                    fallbackSrc={url_gc + selectFile.filename}
                  />
                </Center>
              )
              }
              {selectFile && selectFile.mimetype === "video/mp4" && (<PlayerVideo videoSrc={selectFile.filename} createObjectURL={false} />)}
              {selectFile && selectFile.mimetype === "audio/mpeg" && (<PlayerAudio audioSrc={selectFile.filename} createObjectURL={false} />)}
            </Box>
            <Box mt="10px">
              <Divider />
              <Box>
                <Flex justifyContent={'center'}>
                  {item &&
                    item.files.length > 0 &&
                    item.files.map((file, i) => {
                      if (file) {
                        if (file.mimetype === "image/webp") {
                          return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={false} key={i} />
                        }
                        if (file.mimetype === "video/mp4") {
                          return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={'/static/images/videologo.png'} key={i} />
                        }
                        if (file.mimetype === "audio/mpeg") {
                          return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={'/static/images/audiologo.png'} key={i} />
                        }
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
                Service
              </Text>
              {owner === false && (
                <Box>
                  {favorite === false && (
                    <Button onClick={() => addFavorite()}>
                      <MdStarOutline color="00abd1" />
                    </Button>
                  )}
                  {favorite === true && (
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
              <MdStarOutline color="00abd1" />
              <MdStarOutline color="00abd1" />
              <MdStarOutline color="00abd1" />
              <MdStarOutline color="00abd1" />
              <MdStarOutline color="00abd1" />
              <Text color="#323232" fontSize="14px" fontWeight="300">
                0 Opinions
              </Text>
            </Box>
            <Text>{item.price} {item.currencySymbolPrice || 'ETH'}</Text>
            <Text>0% additional for Yubiai Fee</Text>
            <Text>{item.ubiburningamount || 0.6}% additional for UBI Burner Fee</Text>
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
                  onClick={buyAndCheckoutItem}
                  disabled={owner || !user}
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
        <Box m="1em" h="30vh">
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
  let item = null
  try {
    const { slug } = params
    const res = await axios.get(`/items/item/${slug}`)

    if (!res.data.result) {
      return {
        notFound: true,
      }
    }

    item = res.data.result
    return { props: { item } }
  } catch (err) {
    console.error(err)
    return {
      notFound: true,
    }
  }
}

export default ItemById
