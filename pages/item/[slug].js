import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Text,
  useToast,
  Grid,
  GridItem
} from '@chakra-ui/react'
// import { FaBeer } from 'react-icons/fa';
import { MdStarOutline, MdStar } from 'react-icons/md'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import InfoUserModal from '../../components/Modals/InfoUserModal'
import { useDispatchGlobal } from '../../providers/globalProvider'
import Head from 'next/head'
import { useGlobal } from '../../providers/globalProvider'
import { profileService } from '../../services/profileService'
import ImagePreviewListingCard from '../../components/Cards/ImagePreviewListingCard'
import PlayerVideo from '../../components/Utils/PlayerVideo'
import PlayerAudio from '../../components/Utils/PlayerAudio'
import Questions from '../../components/Layouts/Questions'
import ButtonNewReport from '../../components/Buttons/ButtonNewReport'
import Error from '../../components/Infos/Error'
import useTranslation from 'next-translate/useTranslation';

const ItemById = ({ item }) => {
  const global = useGlobal();
  const toast = useToast();
  const { t } = useTranslation("questions");
  const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  const [owner, setOwner] = useState(null);
  const [favorite, setFavorite] = useState(null);

  const [selectFile, setSelectFile] = useState(null);

  const router = useRouter();
  const dispatch = useDispatchGlobal();

  const title = item && item.title ? `Yubiai Marketplace - ${item.title}` : "Yubiai Marketplace - Item";

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
    await profileService
      .addFavorite(
        (global && global.profile && global.profile._id) || null,
        item || null, global?.profile?.token
      )
      .then((res) => {
        if (res.status === 200) {
          getFavourites()
          actionToat(
            t("Favourites"),
            t("Item added to favourites successfully"),
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
            t("Favourites"),
            t("Item removed from favourites successfully"),
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
  }, [item, global])

  const buyAndCheckoutItem = () => {
    dispatch({
      type: 'SET_ITEM_TO_CHECKOUT',
      payload: item,
    })
    router.push('/checkout')
  }

  if (!item) return <Error error={"Error getting data."} />

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f8f8f8" />
        <meta name="description" content="Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform." />
        <meta name="keywords" content="Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees" />
        <meta name="author" content="Yubiai Members" />
        <meta property="og:title" content="Yubiai a web3 marketplace - Home" />
        <meta property="og:description" content="Marketplace" />
        <meta property="og:url" content="https://www.yubiai.com/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="Robots" content="all" />
      </Head>
      <Container maxW="6xl" h={"full"} display={'flex'} flexDirection={'column'}>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gap={{ base: '1rem', md: '1rem' }}
          mt="1em"
        >
          <GridItem>
            <Flex direction="column">
              {/* Main content */}
              <Box
                height={'600px'}
                m="5px"
              //order={{ base: '1', md: 'none' }}
              >
                <Box
                  width={"full"}
                  height={"80%"}
                  overflow='hidden'
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {selectFile && selectFile.mimetype === "image/webp" && (
                    <Center>
                      <Image
                        alt="Img Item"
                        rounded={'lg'}
                        objectFit={'contain'}
                        width={"full"}
                        height={"full"}
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
              <Box
                m="1em"
                h={"100%"}
              //order={{ base: '2', md: 'none' }}
              >
                <Text mt="10px" fontWeight={"semibold"}>{t("Description")}</Text>
                <Text mt="10px">{item.description}</Text>
              </Box>
            </Flex>
            <ButtonNewReport reference={item._id} type={"Item"} userId={global?.profile?._id} owner={owner} token={global?.profile?.token} t={t} />

            
            <Box m="1em">
              <Questions item={item} profile_id={global?.profile?._id} token={global?.profile?.token} t={t} />
            </Box>


          </GridItem>
          <GridItem>

            <Box
              padding="5px"
              m="5px"
              width={{ base: '100%', md: '100%' }}
              h="546px"
              border={'solid 1px #bababa;'}
              position={{ base: 'relative', md: 'sticky' }}
              borderRadius={'5px'}
              top={{ base: 0, md: '1rem' }}
              alignSelf={{ base: 'center', md: 'initial' }}
            >
              <Flex justifyContent={'space-between'}>
                <Text color="#323232" fontSize="14px" fontWeight="300">
                  {t("Service")}
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
              {global.profile && (
                <InfoUserModal user={item.seller} t={t} />
              )}
              {/* <Box
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
            </Box> */}
              <Text mt="1em">{item.price} {item.currencySymbolPrice}</Text>
              <Text>0% {t("additional for Yubiai Fee")}</Text>
              {/*             <Text>{item.ubiburningamount || 0.6}% {t("additional for UBI Burner Fee")}</Text>
 */}            <Flex
                direction={{ base: 'column' }}
                justifyContent="center"
                w="full"
                h={{ base: "full", md: "300px" }}
              >
                {!owner && (
                  <Center>
                    <Button
                      bg="#00abd1"
                      color="white"
                      w="312px"
                      h="32px"
                      fontSize={'16px'}
                      fontWeight={'600'}
                      onClick={() => buyAndCheckoutItem()}
                      disabled={!global.profile || item.published == false || item.status != 2}
                    >
                      {t("Buy Now")}
                    </Button>
                  </Center>
                )}
              </Flex>

            </Box>



          </GridItem>

        </Grid>
        




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
