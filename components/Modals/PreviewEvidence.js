import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import FilePreviewMini from "../Infos/FilePreviewMini";


const PreviewEvidence = ({ result, previewFiles, selectedFiles }) => {
    console.log(selectedFiles, "selectedFiles")
    return (
        <Box>
            <Text fontWeight={600} fontSize="2xl" mt="1em">Title</Text>
            <Text>{result.title}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">Description</Text>
            <Text>{result.description}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">TransactionHash</Text>
            <Text>{result.transactionHash}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">Order ID</Text>
            <Text>{result.order_id}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">Files Attach</Text>
            <Flex overflowY="auto" width={"full"} mt="1em"
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
                    return (
                        <FilePreviewMini file={file} key={i} removeFile={false} />
                    )
                })}
            </Flex>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">Files Selected</Text>
        
            <Divider />
        </Box>
    )
}

export default PreviewEvidence;