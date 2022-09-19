import { Flex, Input, Button, Box, Text, VStack, StackDivider } from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { useEffect, useRef, useState } from 'react'

// Form
import { useForm } from 'react-hook-form'
import FilePreviewMini from '../Infos/FilePreviewMini'



const FooterChat = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  const { handleSubmit, register, control, formState: { errors }, resetField } = useForm()
  const inputRef = useRef()

  const [previewFiles, setPreviewFiles] = useState([]);

  const verifyFiles = (e) => {

    const tempArr = [];

    [...e.target.files].forEach((file, i) => {
      tempArr.push({
        id: i,
        name: file.name,
        type: file.type
      });
    });

    setPreviewFiles(tempArr);
    return
  }

  const removeFile = (id) => {
    console.log(id)
    const resultado = previewFiles.filter(e => e.id != id);
    console.log(resultado);
    setPreviewFiles(resultado);

  }

  const onSubmit = async (data) => {
    const form = new FormData()

    console.log(data)

  }

  return (
    <Flex w="100%" mt="5">

      <form onSubmit={handleSubmit(onSubmit)} >

        <input
          multiple
          type="file"
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
        divider={<StackDivider borderColor='gray.200' />}
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
        <Flex>
          {previewFiles && previewFiles.length > 0 && previewFiles.map((file, i) => {
            console.log(file)
            return (
              <FilePreviewMini file={file} key={i} removeFile={removeFile} />
            )
          })}

        </Flex>
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
        disabled={inputMessage.trim().length <= 0}
        onClick={handleSendMessage}
        type="submit"
      >
        Send
      </Button>
    </Flex>
  )
}

export default FooterChat
