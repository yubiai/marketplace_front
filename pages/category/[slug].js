import { Flex, SimpleGrid, Text } from '@chakra-ui/react'
import SubCategoriesMenu from '../../components/Menus/SubCategoriesMenu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import axios from 'axios'

const ItemsByCategory = ({items, category}) => {

  const capitalize = (word) => {
    return word && word[0].toUpperCase() + word.slice(1);
  }

  return (
    <>
      <SubCategoriesMenu>
        <Flex alignItems={'center'}>
          <Text fontWeight={'bold'}>Categories</Text>
          <MdKeyboardArrowRight />
           <Text fontWeight={'bold'}>{capitalize(category)}</Text>
          <MdKeyboardArrowRight />
          <Text fontWeight={'bold'}>All</Text>
        </Flex>
        <SimpleGrid minChildWidth="250px" spacing="2px">
            {items && items.length > 0 && items.map((item, i) => {

              return (
                <ItemCardLg key={i} item={item}/>
              )
            })}
        </SimpleGrid>
      </SubCategoriesMenu>
    </>
  )
}

export async function getServerSideProps(context) {
  try {

    const { slug } = context.query;
    const resCategory = await axios.get(`/categories/slug/${slug}`);
    const category = resCategory.data.result.title;

    const resItems = await axios.get(`/items/bycategory/${resCategory.data.result._id}`)
    const items = resItems.data.result;

    return { props: { items, category } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}


export default ItemsByCategory
