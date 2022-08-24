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
import { MdOutlineImage } from 'react-icons/md'
import PlayerAudio from './PlayerAudio'
import PlayerVideo from './PlayerVideo'
import PlayerImage from './PlayerImage'

const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'audio/mpeg'];

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

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log(selectedFile, "selectedFile")
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
    console.log(file)
    if (file && file.size && file.type) {
      const validType = validFileTypes.find((type) => type === file.type);

      if (!validType) {
        setError('Invalid file type.')
        setSelectedFile(null)
        return
      }

      if (file.size > 3e6) {
        setError('Error upload: limit size.')
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
                <MdOutlineImage fontSize="3em" />
                Browse
              </Box>
              <Text color="red.500"> {error && error}</Text>
            </>
          ) : null}
          {selectedFile && imageSrc && <PlayerImage imageSrc={imageSrc} />}
          {selectedFile && videoSrc && <PlayerVideo videoSrc={videoSrc} />}
          {selectedFile && audioSrc && <PlayerAudio audioSrc={audioSrc} />}
        </Box>
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  )
}

FileUpload.defaultProps = {
  acceptedFileTypes: '.jpg, .jpeg, .png, .mp4, .mp3',
  allowMultipleFiles: false,
}

export default FileUpload
