import { Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SubCategoriesMenu from '../../components/Menus/SubCategoriesMenu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import ItemCardLg from '../../components/Cards/ItemCardLg'

const ItemsByCategory = () => {
  const router = useRouter()
  const { category } = router.query
  const capitalize = (word) => {
    return word && word[0].toUpperCase() + word.slice(1);
  }

  // Si no existe category error

  return (
    <>
      <SubCategoriesMenu>
        <Flex alignItems={'center'}>
          <Text fontWeight={'bold'}>Categories</Text>
          <MdKeyboardArrowRight alignContent="center" />
          <Text fontWeight={'bold'}>{capitalize(category)}</Text>
          <MdKeyboardArrowRight />
          <Text fontWeight={'bold'}>All</Text>
        </Flex>
        Listado de Publicaciones de la Categoria: {category}
        <SimpleGrid minChildWidth="250px" spacing="2px">
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
            <ItemCardLg />
        </SimpleGrid>
      </SubCategoriesMenu>
    </>
  )
}

export default ItemsByCategory
