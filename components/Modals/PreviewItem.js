import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ImagePreviewListingCard from '../Cards/ImagePreviewListingCard'
import PlayerAudio from '../Utils/PlayerAudio'
import PlayerVideo from '../Utils/PlayerVideo'

const PreviewItem = ({ item }) => {
  const [selectFile, setSelectFile] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      // Set Item Info
      if (item && item.files.length > 0) {
        setSelectFile(item.files[0])
      }
    }
    loadItem()
  }, [item])


  return (
    <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
      <Box width={'50%'}>
        <Box height={'400px'} width={'full'}>
          {selectFile && (selectFile.type === "image/jpeg" || selectFile.type === "image/jpg" || selectFile.type === "image/png") && (
            <Image
              alt="Img Item"
              rounded={'lg'}
              objectFit={'cover'}
              src={URL.createObjectURL(selectFile)}
            />
          )
          }
          {selectFile && selectFile.type === "video/mp4" && (<PlayerVideo videoSrc={URL.createObjectURL(selectFile)} createObjectURL={true} />)}
          {selectFile && selectFile.type === "audio/mpeg" && (<PlayerAudio audioSrc={URL.createObjectURL(selectFile)} />)}
        </Box>
        <Box>
          <Flex mt="5px" justifyContent={'center'}>
            {item &&
              item.files.length > 0 &&
              item.files.map((file, i) => {
                if (file) {
                  if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
                    return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={false} key={i} />
                  }
                  if (file.type === "video/mp4") {
                    return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={'/static/images/videologo.png'} key={i} />
                  }
                  if (file.type === "audio/mpeg") {
                    return <ImagePreviewListingCard file={file} setSelectFile={setSelectFile} img={'/static/images/audiologo.png'} key={i} />
                  }
                }

              })}
          </Flex>
        </Box>
      </Box>
      <Box width={'50%'} p={'1em'}>
        <Text fontWeight={'bold'}>Title</Text>
        <Text>{item?.title}</Text>

        <Text fontWeight={'bold'}>Net Price: </Text>
        <Text>{item?.price} {item?.currencySymbolPrice}</Text>
        <Text fontWeight={'bold'}>UBI Burning Amount: </Text>
        <Text> {item?.ubiburningamount} % ({item?.price * item?.ubiburningamount / 100} {item?.currencySymbolPrice})</Text>
        <Text fontWeight={'bold'}>Total to receive: </Text>
        <Text>{item?.price - item?.price * item?.ubiburningamount / 100} {item?.currencySymbolPrice}</Text>
        <Text fontWeight={'bold'}>Category: </Text>
        <Text>{item?.category}</Text>
        <Text fontWeight={'bold'}>SubCategory: </Text>
        <Text>{item?.subcategory}</Text>
        <Text fontWeight={'bold'}> Description: </Text>
        <Text>{item?.description}</Text>
      </Box>
    </Flex>
  )
}

export default PreviewItem
