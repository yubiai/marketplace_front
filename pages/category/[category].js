import { Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SubCategoriesMenu from '../../components/Menus/SubCategoriesMenu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import ItemCardLg from '../../components/Cards/ItemCardLg'

const ItemsByCategory = () => {
  const router = useRouter()
  const { category } = router.query

  // Si no existe category error

  return (
    <>
      <SubCategoriesMenu>
        <Flex alignItems={'center'}>
          <Text fontWeight={'bold'}>CATEGORIES</Text>
          <MdKeyboardArrowRight alignContent="center" />
          <Text fontWeight={'bold'}>{category.toLocaleUpperCase()}</Text>
          <MdKeyboardArrowRight />
          <Text fontWeight={'bold'}>ALL</Text>
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
