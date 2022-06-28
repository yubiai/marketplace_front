import { Box, Center, Flex, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const PreviewItem = ({ item }) => {
  const [itemInfo, setItemInfo] = useState(null)
  const [imagesPreview, setImagesPreview] = useState([])
  const [selectImage, setSelectImage] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      console.log(item, 'item PreviewItem')
      setItemInfo(item)
      const filePromises = item.pictures.map((file) => {
        if (file) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async () => {
              try {
                const response = reader.result
                resolve(response)
              } catch (err) {
                reject(err)
              }
            }
            reader.onerror = (error) => {
              reject(error)
            }
            reader.readAsDataURL(file)
          })
        }
      })

      // Wait for all promises to be resolved
      const fileInfos = await Promise.all(filePromises)
      setImagesPreview(fileInfos)
      setSelectImage(fileInfos[0])
    }
    loadItem()
  }, [item])

  return (
    <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
      <Box width={'50%'}>
        <Box>
          {imagesPreview && imagesPreview[0] && (
            <Center>
              <Image
                alt="Img Item"
                rounded={'lg'}
                height={'400px'}
                width={'full'}
                objectFit={'cover'}
                src={selectImage}
              />
            </Center>
          )}
        </Box>
        <Box>
          <Flex mt="5px" justifyContent={'center'}>
            {imagesPreview &&
              imagesPreview.length > 0 &&
              imagesPreview.map((image, i) => {
                if (image) {
                  return (
                    <Center m="1px" key={i}>
                      <Image
                        alt="Img Item"
                        rounded={'lg'}
                        height={'70px'}
                        width={'100px'}
                        cursor="pointer"
                        objectFit={'cover'}
                        src={image}
                        onClick={() => setSelectImage(image)}
                      />
                    </Center>
                  )
                }
              })}
          </Flex>
        </Box>
      </Box>
      <Box width={'50%'} p={'1em'}>
        <Text fontWeight={'bold'}>Title</Text>
        <Text>{itemInfo?.title}</Text>

        <Text fontWeight={'bold'}>Net Price: </Text>
        <Text>{itemInfo?.price} {itemInfo?.currencySymbolPrice}</Text>
        <Text fontWeight={'bold'}>UBI Burning Amount: </Text>
        <Text> {itemInfo?.ubiburningamount} % ({itemInfo?.price * itemInfo?.ubiburningamount / 100} {itemInfo?.currencySymbolPrice})</Text>
        <Text fontWeight={'bold'}>Total to receive: </Text>
        <Text>{itemInfo?.price - itemInfo?.price * itemInfo?.ubiburningamount / 100 } {itemInfo?.currencySymbolPrice}</Text>
        <Text fontWeight={'bold'}>Category: </Text>
        <Text>{itemInfo?.category}</Text>
        <Text fontWeight={'bold'}>SubCategory: </Text>
        <Text>{itemInfo?.subcategory}</Text>
        <Text fontWeight={'bold'}> Description: </Text>
        <Text>{itemInfo?.description}</Text>
      </Box>
    </Flex>
  )
}

export default PreviewItem
