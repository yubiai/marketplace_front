import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import ViewMsgFile from "../Cards/ViewMsgFile";
import ViewMsgText from "../Cards/ViewMsgText";
import FilePreviewMini from "../Infos/FilePreviewMini";

const PreviewEvidence = ({ result, previewFiles, selectedMsg }) => {

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
            {previewFiles && previewFiles.length > 0 && (
                <>
                    <Divider />
                    <Text fontWeight={600} fontSize="2xl" mt="1em">Attached files</Text>
                </>
            )}
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
                        <div key={i}>
                            <FilePreviewMini file={file} removeFile={false} />
                        </div>
                    )
                })}
            </Flex>
            {selectedMsg && selectedMsg.length > 0 && (
                <>
                    <Divider />
                    <Text fontWeight={600} fontSize="2xl" mt="1em">Messages</Text>
                </>
            )}
            {selectedMsg && selectedMsg.length > 0 && selectedMsg.map((msg, i) => {
                return (
                    <Flex key={i}>
                        {msg.text && (
                            ViewMsgText(msg)
                        )}
                        {msg.file && (
                            ViewMsgFile(msg)
                        )}
                    </Flex>
                )
            })}
            <Divider />
        </Box>
    )
}

export default PreviewEvidence;