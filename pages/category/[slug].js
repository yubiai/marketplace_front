import { Box, Button, Center, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import SubCategoriesMenu from '../../components/Menus/SubCategoriesMenu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import axios from 'axios'
import Loading from '../../components/Spinners/Loading'
import Paginations from '../../components/Layouts/Paginations'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import Error from '../../components/Infos/Error'
import { useEffect } from 'react'
import useFetch from '../../hooks/data/useFetch'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation';
import SEO from '../../components/Utils/SEO'


const ItemsByCategory = ({ response, category }) => {
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const router = useRouter();
  const { t } = useTranslation("categories");
  const { data, isLoading, isError } = useFetch(
    `/items/?page=${global.pageIndex}&size=8&categoryId=${category ? category._id : ''
    }&subcategoryId=${global.subCategory ? global.subCategory : ''}`,
    {
      initialData: response,
    }
  )

  useEffect(() => {
    const initial = () => {
      dispatch({
        type: 'RESETPAGEINDEX',
      })
      dispatch({
        type: 'SELECTSUBCATEGORY',
        payload: '',
      })
    }
    initial()
  }, [dispatch])

  const capitalize = (word) => {
    return word && word[0].toUpperCase() + word.slice(1)
  }

  if (isError) {
    return <Error error={"Error getting data."} />
  }

  if (!data || isLoading) return <Loading />

  return (
    <>
      <SEO
        title={category && category.title}
        description={"Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform."}
        keywords="Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"
        imageUrl={"/static/apple-touch-icon.png"}
      />
      <SubCategoriesMenu category={category && category._id}>
        <Box
          maxW="6xl"
          h={{
            base: data && data.items && data.items.length > 1 ? 'full' : '80vh',
            md: data && data.items && data.items.length > 4 ? 'full' : '100vh'
          }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Flex alignItems={'center'}>
            <Text fontWeight={'bold'}>{t("Categories")}</Text>
            <MdKeyboardArrowRight />
            <Text fontWeight={'bold'}>
              {capitalize(category && category.title)}
            </Text>
            {/*<MdKeyboardArrowRight />
           <Text fontWeight={'bold'}>{global.subCategory}</Text>
            */}{' '}
          </Flex>
          {data && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">{t("There is no item published in this subcategory")}</Heading>
              </Center>
              <Center>
                <Button bg="#00abd1" color="white" _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
                  {t("Go Back")}
                </Button>
              </Center>
            </>
          )}
          <Grid
            templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
            templateColumns={{ base: 'none', md: 'repeat(4, 1fr)' }}
            gap={1}
          >
            {data &&
              data.items.length > 0 &&
              data.items.map((item, i) => {
                return (
                  <ItemCardLg key={i} item={item} t={t} />
                )
              })}
          </Grid>

          <Paginations data={data ? data : null} />
        </Box>
      </SubCategoriesMenu>
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
    const resCategory = await axios.get(`/categories/slug/${slug}`)
    const category = resCategory.data.result
    const resItems = await axios.get(
      `/items/?size=8&categoryId=${category._id}`
    )
    const response = resItems.data

    return { props: { response, category } }
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }
}

export default ItemsByCategory
