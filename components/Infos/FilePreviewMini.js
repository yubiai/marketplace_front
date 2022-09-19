import { Box, Button, Center, Text } from "@chakra-ui/react";
import { FaFileImage } from 'react-icons/fa';
import { SmallCloseIcon } from '@chakra-ui/icons'


const FilePreviewMini = ({ file, removeFile }) => {

    return (
        <Box m="5px" p="5px" bg="gray.200" w="100px">
           <Box position="relative" float="right" >
           <Button bg="transparent" size="5px" onClick={() => removeFile(file.id)}>
                <SmallCloseIcon />
            </Button>
           </Box>
            <Center> <FaFileImage size={'3em'} /> </Center>
            <Text fontSize={"sm"}
            >{file.name.slice(0, 10)}</Text>
        </Box>
    )
}

export default FilePreviewMini;

