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
import { useGlobal } from '../../providers/globalProvider'
import { profileService } from '../../services/profileService'
import ImagePreviewListingCard from '../../components/Cards/ImagePreviewListingCard'
import PlayerVideo from '../../components/Utils/PlayerVideo'
import PlayerAudio from '../../components/Utils/PlayerAudio'
import Questions from '../../components/Layouts/Questions'
import ButtonNewReport from '../../components/Buttons/ButtonNewReport'
import Error from '../../components/Infos/Error'
import useTranslation from 'next-translate/useTranslation';
import SEO from '../../components/Utils/SEO'
import ButtonNewChannel from '../../components/Buttons/ButtonNewChannel'
import EditorRead from '../../components/Editor/EditorRead'
import { getDescriptionSeo } from '../../utils/itemUtils'

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
      <SEO
        title={title}
        description={getDescriptionSeo(item.description)}
        keywords="Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"
        imageUrl={"https://images.yubiai.market/3547361c-6cea-4745-8807-5760c4eafa94-bucket/prod/" + item.files[0].filename}
      />
      <Container
        maxW="6xl"
        h={"full"}
        display={'flex'}
        flexDirection={'column'}
      >
        <Box mt="1em" display={{ base: 'block', sm: 'block', md: 'none' }}>
          <Text color="#323232" fontSize="14px" fontWeight="300">
            {t("Service")}
          </Text>
          <Text fontSize="20px" fontWeight="600"
          >
            {item.title}
          </Text>
          {global.profile && (
            <InfoUserModal user={item.seller} t={t} />
          )}
        </Box>

        <Flex width={'full'} direction={{ base: 'column', md: 'row' }} mt="1em">

          <Box width={{ base: '100%', md: '66%' }} height={'100%'} m="5px">
            <Box width={"full"} height={"80%"} overflow='hidden' display={"flex"} alignItems={"center"} justifyContent={"center"}>
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
            <Box
              padding="1em"
              mt="1em"
              width={{ base: '100%', md: '33%' }}
              h={{ base: "300px", md: "500px" }}
              border={'solid 1px #bababa;'}
              borderRadius={'5px'}
              display={{ base: 'block', sm: 'block', md: 'none' }}
            >
              <Flex justifyContent={'space-between'}>

                <Text mt="8px">{item.price} {item.currencySymbolPrice}</Text>
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
              <Text>0% {t("additional for Yubiai Fee")}</Text>
              {/*             <Text>{item.ubiburningamount || 0.6}% {t("additional for UBI Burner Fee")}</Text>*/}
              {owner === false && global?.profile?._id && (
                <>
                  <Center mt="4em">
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
                  <Flex mt="4em" justifyContent={'space-between'}>
                    <ButtonNewChannel buyer={global?.profile?._id} seller={item.seller._id} item_id={item._id} profile={global?.profile} t={t} />
                    <ButtonNewReport reference={item._id} type={"Item"} userId={global?.profile?._id} owner={owner} token={global?.profile?.token} t={t} />
                  </Flex>
                </>
              )}

            </Box>
            <Box mt="2em">
              <Divider />
              <Box m="1em" h={"100%"}>
                <Text mt="10px" fontWeight={"semibold"}>{t("Description")}</Text>
                <EditorRead content={item.description} />
              </Box>
              <Divider mt="2em" />
              <Box m="1em">
                <Questions item={item} profile_id={global?.profile?._id} token={global?.profile?.token} t={t} />
              </Box>
            </Box>
          </Box>
          <Box
            padding="5px"
            m="5px"
            width={{ base: '100%', md: '33%' }}
            h={{ base: "200px", md: "500px" }}
            border={'solid 1px #bababa;'}
            borderRadius={'5px'}
            display={{ base: 'none', sm: 'none', md: 'block' }}
            position={{ base: "", sm: 'sticky' }}
            top={{ md: '1rem' }}
          >
            <Box>
              <Flex justifyContent={'space-between'}>
                <Text mt="10px" color="#323232" fontSize="14px" fontWeight="300">
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

              <Text fontSize="20px" fontWeight="600"
              >
                {item.title}
              </Text>
              {global.profile && (
                <InfoUserModal user={item.seller} t={t} />
              )}
            </Box>
            <Text mt="1em">{item && item.typeprice && item.typeprice != "To settle" && (<>
              {item.price} {item.currencySymbolPrice}</>)} ({t(`${item.typeprice}`)})</Text>
            <Text mt="5px">0% {t("additional for Yubiai Fee")}</Text>
            {/*             <Text>{item.ubiburningamount || 0.6}% {t("additional for UBI Burner Fee")}</Text>*/}
            <Flex
              direction={{ base: 'column' }}
              justifyContent="center"
              w="full"
              h={{ base: "full", md: "300px" }}
            >
              {owner === false && global?.profile?._id && (
                <>
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

                  <Box position={"absolute"} left={2} bottom={0}>
                    <ButtonNewChannel buyer={global?.profile?._id} seller={item.seller._id} item_id={item._id} profile={global?.profile} t={t} />
                  </Box>

                  <Box position={"absolute"} right={2} bottom={0}>
                    <ButtonNewReport reference={item._id} type={"Item"} userId={global?.profile?._id} owner={owner} token={global?.profile?.token} t={t} />
                  </Box>
                </>
              )}
            </Flex>
          </Box>
        </Flex>
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
