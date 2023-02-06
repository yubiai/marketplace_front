import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useState } from 'react'
import ImagePreviewListingCard from '../Cards/ImagePreviewListingCard'
import PlayerAudio from '../Utils/PlayerAudio'
import PlayerVideo from '../Utils/PlayerVideo'
import { useTranslation } from "react-i18next";

const PreviewItem = ({ item }) => {
  const [selectFile, setSelectFile] = useState(item && item.files[0])
  const { t } = useTranslation("newlisting");

  return (
    <Flex width={'full'} direction={{ base: 'column', sm: 'column', md: 'row' }}>
      <Box width={{base: "100%", sm: "100%", md: "50%"}}>
        <Box height={'500px'} width={'full'}>
          {selectFile && (selectFile.type === "image/jpeg" || selectFile.type === "image/jpg" || selectFile.type === "image/png" || selectFile.type === "image/webp") && (
            <Image
              alt="Img Item"
              rounded={'lg'}
              objectFit={'cover'}
              h="100%"
              src={selectFile && URL.createObjectURL(selectFile)}
              fallbackSrc={selectFile && URL.createObjectURL(selectFile)}
            />
          )
          }
          {selectFile && selectFile.type === "video/mp4" && (<PlayerVideo videoSrc={URL.createObjectURL(selectFile)} createObjectURL={true} />)}
          {selectFile && selectFile.type === "audio/mpeg" && (<PlayerAudio audioSrc={URL.createObjectURL(selectFile)} createObjectURL={true} />)}
        </Box>
        <Box>
          <Flex mt="5px" justifyContent={'center'}>

            {item &&
              item.files.length > 0 &&
              item.files.map((file, i) => {
                if (file) {
                  if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" || file.type === "image/webp") {
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
      <Box width={{base: "100%", sm: "100%", md: "50%"}} p={'1em'}>
        <Text fontWeight={'bold'}>{t("Title")}</Text>
        <Text>{item?.title}</Text>
        <Text fontWeight={'bold'}>{t("Description")}</Text>
        <Text>{item?.description}</Text>
        <Text fontWeight={'bold'}>{t("Category")}</Text>
        <Text>{item?.category}</Text>
        <Text fontWeight={'bold'}>{t("Sub Category")} </Text>
        <Text>{item?.subcategory}</Text>
        <Text fontWeight={'bold'}>{t("Net Price")} </Text>
        <Text>{item?.price} {item?.currencySymbolPrice}</Text>
        <Text fontWeight={'bold'}>{t("UBI Burning Amount")} </Text>
        <Text> {item?.ubiburningamount} % ({item?.price * item?.ubiburningamount / 100} {item?.currencySymbolPrice})</Text>
        <Text fontWeight={'bold'}>{t("Total to receive")} </Text>
        <Text>{item?.price - item?.price * item?.ubiburningamount / 100} {item?.currencySymbolPrice}</Text>


      </Box>
    </Flex>
  )
}

export default PreviewItem
