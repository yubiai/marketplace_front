/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  Box,
  Text,
  Center,
  Button,
} from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineFileUpload } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'

import PlayerAudio from './PlayerAudio'
import PlayerVideo from './PlayerVideo'
import PlayerImage from './PlayerImage'
import PlayerVideoEditItem from './PlayerVideoEditItem'
import PlayerAudioEditItem from './PlayerAudioEditItem'

export const FileUpload = ({
  name,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
  resetField,
  fileExist
}) => {
  const inputRef = useRef()
  const {
    field: { ref, onChange, value, ...inputProps },
    // eslint-disable-next-line no-unused-vars
    fieldState: { invalid },
    formState: { errors }
  } = useController({
    name,
    control,
    rules: { required: isRequired }
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null)

  const clearSrc = () => {
    resetField(name)
    setImageSrc(null)
    setVideoSrc(null)
    setAudioSrc(null)
    setSelectedFile(null)
    setErrorMsg(null)
  }

  useEffect(() => {
    if (selectedFile && selectedFile.type) {
      if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg" || selectedFile.type === "image/png" || selectedFile.type === "image/webp") {
        setImageSrc(URL.createObjectURL(selectedFile))
      }
      if (selectedFile.type === "video/mp4") {
        setVideoSrc(URL.createObjectURL(selectedFile))
      }
      if (selectedFile.type === "audio/mpeg") {
        setAudioSrc(URL.createObjectURL(selectedFile))
      }
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log(fileExist)
    if (fileExist) {
      if (fileExist.mimetype === "image/jpeg" || fileExist.mimetype === "image/jpg" || fileExist.mimetype === "image/png" || fileExist.mimetype === "image/webp") {
        setImageSrc(fileExist)
      }
      if (fileExist.mimetype === "video/mp4") {
        setVideoSrc(fileExist)
      }
      if (fileExist.mimetype === "audio/mpeg") {
        setAudioSrc(fileExist)
      }
    }
    return
  }, [fileExist])

  const verifyImage = (file) => {
    if (file && file.size && file.type) {
      clearSrc()

      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const validImageType = validImageTypes.find((type) => type === file.type);

      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg'];
      const validFileType = validFileTypes.find((type) => type === file.type);

      if (!validImageType && isRequired === true) {
        setErrorMsg('Error: Invalid file type.')
        setSelectedFile(null)
        return
      }

      if (!validFileType && isRequired === false) {
        setErrorMsg('Error: Invalid file type.')
        setSelectedFile(null)
        return
      }

      if (file.size > 1e7) {
        setErrorMsg('Error: Limit size.')
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      onChange(file)
      return
    }
  }

  return (
    <FormControl isInvalid={invalid} isRequired={isRequired && isRequired}>
      <FormLabel htmlFor="writeUpFile" textAlign={"center"} mt="1em" fontWeight='semibold'>{children}</FormLabel>
      <InputGroup>
        <input
          type="file"
          onChange={(e) => {
            verifyImage(e.target.files[0])
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
          {!selectedFile ? (
            <>
              <Box
                w="full"
                h="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {fileExist ? (
                  <>
                    {imageSrc && <PlayerImage imageSrc={imageSrc} />}
                    {videoSrc && <PlayerVideoEditItem videoSrc={videoSrc} />}
                    {audioSrc && <PlayerAudioEditItem audioSrc={audioSrc} />}
                  </>
                ) : (<MdOutlineFileUpload fontSize="3em" />)}
              </Box>
              <Text color="red.500"> {errorMsg && errorMsg}</Text>
            </>
          ) : null}
          {selectedFile && imageSrc && <PlayerImage imageSrc={imageSrc} />}
          {selectedFile && videoSrc && <PlayerVideo videoSrc={videoSrc} createObjectURL={true} />}
          {selectedFile && audioSrc && <PlayerAudio audioSrc={audioSrc} createObjectURL={true} />}
        </Box>
      </InputGroup>
      <Center>
        <Button onClick={() => clearSrc()} _hover={{ bg: 'gray.300' }}
        >
          <FaTrash fontSize="1em" />
        </Button>
      </Center>
      <Text color="red">{errors && errors.file1 && name === "file1" && "Image Main Rest"}</Text>
    </FormControl>
  )
}

FileUpload.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
}

export default FileUpload
