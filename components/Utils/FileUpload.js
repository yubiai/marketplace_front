import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Icon,
  Box,
  Center,
  Image,
  Text,
  Flex,
} from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineImage } from 'react-icons/md'

export const FileUpload = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
}) => {
  const inputRef = useRef()
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage])

  return (
    <FormControl isInvalid={invalid} isRequired>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <input
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          {...inputProps}
          style={{ display: 'none' }}
        />
        <Box
          w={'full'}
          h={'200px'}
          border={'1px dashed grey'}
          bg={'#f5f5f5'}
          m={'1em'}
          onClick={() => inputRef.current.click()}
        >
          <Center width={'full'} h={'full'}>
            {!imageUrl && (
              <Text textAlign={'center'}>
                <MdOutlineImage fontSize="3em" />
                <Text color="#1c548b">Browse</Text>
              </Text>
            )}
            {imageUrl && selectedImage && (
              <Image
                alt={selectedImage.name}
                rounded={'lg'}
                height={'full'}
                width={'full'}
                objectFit={'cover'}
                src={imageUrl}
              />
            )}
          </Center>
        </Box>
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  )
}

FileUpload.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
}

export default FileUpload
