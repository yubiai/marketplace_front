import { Box, Button, Center, Text } from "@chakra-ui/react";
import { SmallCloseIcon } from '@chakra-ui/icons'
import FileIcon from "./FileIcon";

const FilePreviewMini = ({ file, removeFile }) => {

    return (
        <Box m="5px" p="4px" bg="gray.200" minW={"75px"} w={"75px"}>
            {removeFile != false && (
                <Button bg="transparent" float="right" size="10px" onClick={() => removeFile(file.id)}>
                    <SmallCloseIcon />
                </Button>
            )}
            <Center>
                <FileIcon type={file.data.type} />
            </Center>
            <Center>
                <Text fontSize={"0.7em"}
                >{file.data.name.slice(0, 9)}</Text>
            </Center>
        </Box>
    )
}

export default FilePreviewMini;

