/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  Box,
  Center,
  Image,
  Text,
} from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineImage } from 'react-icons/md'

export const FileUpload = ({
  name,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
}) => {
  const inputRef = useRef()
  const {
    field: { ref, onChange, value, ...inputProps },
    // eslint-disable-next-line no-unused-vars
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

  useEffect(() => {
    console.log(imageUrl, 'imageUrlimageUrl')
    console.log(selectedImage, 'selectedImage')
  }, [imageUrl, selectedImage])

  return (
    <FormControl isInvalid={invalid} isRequired={isRequired && isRequired}>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <input
          type="file"
          onChange={(e) => {
            setSelectedImage(e.target.files[0])
            onChange(e.target.files[0])
          }}
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
          cursor="pointer"
          onClick={() => inputRef.current.click()}
        >
          {!imageUrl || !selectedImage ? (
            <Box
              w="full"
              h="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <MdOutlineImage fontSize="3em" />
              Browse
            </Box>
          ) : null}
          {imageUrl && selectedImage && (
            <Image
              alt={selectedImage && selectedImage.name}
              rounded={'lg'}
              height={'full'}
              width={'full'}
              objectFit={'cover'}
              src={imageUrl}
            />
          )}
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
