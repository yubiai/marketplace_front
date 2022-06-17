import { Flex, SimpleGrid, Text } from '@chakra-ui/react'
import SubCategoriesMenu from '../../components/Menus/SubCategoriesMenu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import axios from 'axios'
import Loading from '../../components/Spinners/Loading'
import Head from 'next/head'
import Paginations from '../../components/Layouts/Paginations'
import useSWR from 'swr'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import Error from '../../components/Infos/Error'
import { useEffect } from 'react'

const ItemsByCategory = ({ response, category }) => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()

  const { data, error } = useSWR(
    `/items/?page=${global.pageIndex}&categoryId=${
      category ? category._id : ''
    }&subcategoryId=${global.subCategory ? global.subCategory : ''}`,
    {
      initialData: response
    }
  )

  useEffect(() => {
    dispatch({
      type: 'RESETPAGEINDEX',
    })
    dispatch({
      type: 'SELECTSUBCATEGORY',
      payload: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const capitalize = (word) => {
    return word && word[0].toUpperCase() + word.slice(1)
  }

  if (!data || !category) return <Loading />

  if (error) {
    return <Error error={error?.message} />
  }

  console.log(data.items.length)

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - {category.title}</title>
      </Head>
      <SubCategoriesMenu category={category._id}>
        <Flex alignItems={'center'}>
          <Text fontWeight={'bold'}>Categories</Text>
          <MdKeyboardArrowRight />
          <Text fontWeight={'bold'}>{capitalize(category && category.title)}</Text>
          {/*<MdKeyboardArrowRight />
           <Text fontWeight={'bold'}>{global.subCategory}</Text>
 */}        </Flex>
        <SimpleGrid minChildWidth="250px" spacing="1px" h={{base: 'full', sm: 'full', md: data.items.length == 12 ? 'full': '900px'}}>
          {data &&
            data.items.length > 0 &&
            data.items.map((item, i) => {
              return <ItemCardLg key={i} item={item} />
            })}
        </SimpleGrid>
        <Paginations data={data} />
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
    const category = resCategory.data.result;
    const resItems = await axios.get(
      `/items/?size=12&categoryId=${category._id}`
    )
    const response = resItems.data

    return { props: { response, category } }
  } catch (err) {
    console.log(err)
    return { notFound: true };
  }
}

export default ItemsByCategory
