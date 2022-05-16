import { Box, Center, Flex, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const PreviewItem = ({ item }) => {
  const [itemInfo, setItemInfo] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const loadItem = () => {
      console.log(item.pictures[0])
      setItemInfo(item)

      let fileImg = item.pictures[0]
      const reader = new FileReader()

      reader.readAsDataURL(fileImg)

      reader.onload = () => {
        setImagePreview(reader.result)
      }
    }
    loadItem()
  }, [item])

  return (
    <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
      <Box width={'full'}>
        <Center>
          <Image
            alt="Img Item"
            rounded={'lg'}
            height={'400px'}
            width={'full'}
            objectFit={'cover'}
            src={imagePreview}
          />
        </Center>
      </Box>
      <Box width={'full'} p={'1em'}>
        <Text fontWeight={'bold'}>Title</Text>
        <Text>{itemInfo?.title}</Text>

        <Text fontWeight={'bold'}> Description: </Text>
        <Text>{itemInfo?.description}</Text>
        <Text fontWeight={'bold'}>Price: </Text>
        <Text>{itemInfo?.price}</Text>

        <Text fontWeight={'bold'}>Category: </Text>
        <Text>{itemInfo?.category}</Text>

        <Text fontWeight={'bold'}>SubCategory: </Text>
        <Text>{itemInfo?.subcategory}</Text>
      </Box>
    </Flex>
  )
}

export default PreviewItem
