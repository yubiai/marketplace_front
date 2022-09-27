import { Badge, Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import FileIcon from "../Infos/FileIcon";
import FilePreviewMini from "../Infos/FilePreviewMini";


const PreviewEvidence = ({ result, previewFiles, selectedFiles }) => {

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
            {selectedFiles && selectedFiles.length > 0 && (
                <>
                    <Divider />
                    <Text fontWeight={600} fontSize="2xl" mt="1em">Channel selected files</Text>
                </>
            )}
            {selectedFiles.length > 0 && selectedFiles.map((file, i) => {
                return (
                    <Stack
                        key={i}
                        mt="5px"
                        direction={{ base: 'column', md: 'row' }}
                        justifyContent="left">
                        <Flex>
                            <FileIcon type={file?.mimetype} />
                            <Box ml='3'>
                                <Text fontWeight='bold' fontSize='sm'>
                                    {file?.filename}
                                    <Badge ml='1' colorScheme='green'>
                                        {file?.author.first_name} {file?.author.last_name}
                                    </Badge>
                                </Text>
                                <Text fontSize='sm'>{moment(file?.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                            </Box>
                        </Flex>
                    </Stack>
                )
            })}
            <Divider />
        </Box>
    )
}

export default PreviewEvidence;