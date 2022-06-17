import React, { useEffect, useState } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  RadioGroup,
  Radio,
} from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import useFetch from '../../hooks/data/useFetch'
import Error from '../Infos/Error'
import Loading from '../Spinners/Loading'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'

export default function SubCategoriesMenu({ children, category }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, loading, error } = useFetch(`/subcategories/${category}`)

  if (loading) return <Loading />

  if (error) {
    return <Error error={error?.message} />
  }

  return (
    <Box
      h={'full'}
      m="2em"
      bg={'gray.100'}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        subcategories={data}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} subcategories={data} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" >
        {children}
      </Box>
    </Box>
  )
}

const SidebarContent = ({ onClose, subcategories, ...rest }) => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()

  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(global.subCategory)
  }, [global.subCategory])

  const selectSubCategory = (subCategory) => {
    setValue(subCategory)
    dispatch({
      type: 'SELECTSUBCATEGORY',
      payload: subCategory,
    })
  }

  return (
    <Box
      bg={'white'}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'full', md: 60 }}
      pos="absolute"
      h="900px"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="18px"
          fontFamily="Open Sans, sans-serif"
          fontWeight="normal"
        >
          Sub - Categories
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <RadioGroup onChange={(e) => selectSubCategory(e)} value={value}>
        <NavItem>{{
          title: "All",
          _id: ""
        }}</NavItem>
      </RadioGroup>
      {subcategories &&
        subcategories.length > 0 &&
        subcategories.map((subcategory, i) => {
          if (
            subcategory &&
            subcategory.items &&
            subcategory.items.length > 0
          ) {
            return (
              <RadioGroup
                key={i}
                onChange={(e) => selectSubCategory(e)}
                value={value}
              >
                <NavItem>{subcategory}</NavItem>
              </RadioGroup>
            )
          }
        })}
    </Box>
  )
}

const NavItem = ({ children, ...rest }) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
      {...rest}
    >
      <Radio value={children._id}>{children.title}</Radio>
    </Flex>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={'white'}
      borderBottomWidth="1px"
      borderBottomColor={'gray.200'}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="1em" ml="8" fontFamily="monospace" fontWeight="bold">
        Sub - Categories
      </Text>
    </Flex>
  )
}
