/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  Box,
  Text,
} from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineFileUpload } from 'react-icons/md'
import PlayerAudio from './PlayerAudio'
import PlayerVideo from './PlayerVideo'
import PlayerImage from './PlayerImage'

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
    fieldState: {invalid},
    formState: { errors }
  } = useController({
    name,
    control,
    rules: { required: isRequired}
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null)

  const clearSrc = () => {
    setImageSrc(null)
    setVideoSrc(null)
    setAudioSrc(null)
    setSelectedFile(null)
    setErrorMsg(null)
  }

  useEffect(() => {
    if (selectedFile && selectedFile.type) {
      if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg" || selectedFile.type === "image/png") {
        setImageSrc(URL.createObjectURL(selectedFile))
      }
      if (selectedFile.type === "video/mp4") {
        setVideoSrc(URL.createObjectURL(selectedFile))
      }
      if (selectedFile.type === "audio/mpeg") {
        setAudioSrc(URL.createObjectURL(selectedFile))
      }
    }
  }, [selectedFile])

  const verifyImage = (file) => {
    clearSrc()
    if (file && file.size && file.type) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const validImageType = validImageTypes.find((type) => type === file.type);

      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'audio/mpeg'];
      const validFileType = validFileTypes.find((type) => type === file.type);

      if (!validImageType && isRequired === true) {
        setErrorMsg('Invalid file type.')
        setSelectedFile(null)
        return
      }

      if (!validFileType && isRequired === false) {
        setErrorMsg('Invalid file type.')
        setSelectedFile(null)
        return
      }

      if (file.size > 1e7) {
        setErrorMsg('errorMsg upload: limit size.')
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
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
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
                <MdOutlineFileUpload fontSize="3em" />
              </Box>
              <Text color="red.500"> {errorMsg && errorMsg}</Text>
            </>
          ) : null}
          {selectedFile && imageSrc && <PlayerImage imageSrc={imageSrc} />}
          {selectedFile && videoSrc && <PlayerVideo videoSrc={videoSrc} createObjectURL={true} />}
          {selectedFile && audioSrc && <PlayerAudio audioSrc={audioSrc} />}
        </Box>
      </InputGroup>
      <Text color="red">{errors && errors.file1 && name === "file1" && "Image Main Rest"}</Text>
    </FormControl>
  )
}

FileUpload.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
}

export default FileUpload
