import { Flex, Input, Button, Box, Text, VStack, Spinner, Center } from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'

// Form
import FilePreviewMini from '../Infos/FilePreviewMini'

const acceptedFileTypes = 'image/jpeg, image/jpg, image/png, image/webp, video/mp4, audio/mpeg, application/pdf'
const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg', 'application/pdf'];

const FooterChat = ({ inputMessage, setInputMessage, previewFiles, setPreviewFiles, handleSendMessage, loadingSubmit }) => {

  const inputRef = useRef()
  const [errorMsg, setErrorMsg] = useState(null)


  const verifyFiles = (e) => {

    console.log(previewFiles, "previewFiles")

    if (e.target.files && e.target.files.length === 0) {
      return
    }

    if (previewFiles.length + e.target.files.length > 10) {
      console.error('Maximum files per message is 10')
      setErrorMsg('Maximum files per message is 10')
      return
    }

    const tempArr = [
      ...previewFiles
    ];

    [...e.target.files].forEach((file) => {

      // Verify Exists
      const verifyExists = tempArr.filter(e => e.name == file.name && e.size == file.size)
      if (verifyExists.length > 0) {
        console.error("The file is already added: " + file.name);
        return
      }

      // Verify Type
      const validFileType = fileTypes.find((type) => type === file.type);
      if (!validFileType) {
        console.error('Error: Invalid file type.')
        setErrorMsg('Error: Invalid file type.')
        return
      }

      // Verify Size
      if (file.size > 5e+7) {
        console.error('Error: Limit size.')
        setErrorMsg('Error: Limit size.')
        return
      }

      // Add
      tempArr.push({
        id: file.name.slice(0, 5) + Math.floor(Math.random() * 99999),
        data: file
      });

      setErrorMsg(null)
      return
    });

    setPreviewFiles(tempArr);
    return
  }

  const removeFile = (id) => {
    console.log(previewFiles, "previewsds removegfile")
    console.log(id, "id removegfile")

    const result = previewFiles.filter(e => e.id !== id);

    if (!result) {
      return
    }

    setPreviewFiles(result);
    return;
  }

  if (loadingSubmit == true) {
    return (
      <Box w="100%" mt="1em">
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </Center>
      </Box>
    )
  }

  return (
    <Flex w="100%" mt="5">
      <form >
        <input
          multiple
          type="file"
          accept={acceptedFileTypes}
          ref={inputRef}
          name="files"
          onChange={verifyFiles}
          style={{ display: 'none' }}
        />
        <Button onClick={() => inputRef.current.click()}
        >
          <AttachmentIcon w={6} h={6} />
        </Button>
      </form>
      <VStack
        spacing={4}
        align='stretch'
        width={"100%"}
      >

        <Input
          placeholder="Type Something..."
          border="none"
          borderRadius="none"
          _focus={{
            border: '1px solid black',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Flex overflowY="auto" width={{ base: '200px', md: '450px' }}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray',
              borderRadius: '24px',
            },
          }}>
          {previewFiles && previewFiles.length > 0 && previewFiles.map((file, i) => {
            console.log(file)
            return (
              <FilePreviewMini file={file} key={i} removeFile={removeFile} />
            )
          })}
        </Flex>


        {errorMsg && (
          <Box>
            <Text color="red" size="sm">{errorMsg}</Text>
          </Box>
        )}
      </VStack>
      <Button
        bg="black"
        color="white"
        borderRadius="none"
        _hover={{
          bg: 'white',
          color: 'black',
          border: '1px solid black',
        }}
        disabled={inputMessage.trim().length <= 0 && previewFiles.length === 0 || loadingSubmit === true}
        onClick={handleSendMessage}
        type="submit"
      >
        Send
      </Button>
    </Flex>
  )
}

export default FooterChat
