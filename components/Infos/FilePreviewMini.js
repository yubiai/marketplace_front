import { Box, Button, Center, Text } from "@chakra-ui/react";
import { FaFileImage } from 'react-icons/fa';
import { SmallCloseIcon } from '@chakra-ui/icons'


const FilePreviewMini = ({ file, removeFile }) => {

    return (
            <Box m="5px" p="4px" bg="gray.200" minW={"75px"} w={"75px"}>
                <Button  bg="transparent" float="right" size="10px" onClick={() => removeFile(file.id)}>
                    <SmallCloseIcon />
                </Button>
                <Center> <FaFileImage size={'2.5em'} /> </Center>
                <Center>
                    <Text fontSize={"0.7em"}
                    >{file.data.name.slice(0, 9)}</Text>
                </Center>
            </Box>
    )
}

export default FilePreviewMini;

