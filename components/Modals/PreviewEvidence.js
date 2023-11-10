import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import ViewMsgFile from "../Cards/ViewMsgFile";
import ViewMsgText from "../Cards/ViewMsgText";
import FilePreviewMini from "../Infos/FilePreviewMini";
import { formatUnits } from '@ethersproject/units';

const PreviewEvidence = ({ result, transactionHash, previewFiles, selectedMsg, t }) => {

    return (
        <Box>
            <Text fontWeight={600} fontSize="2xl" mt="1em">{t("Title")}</Text>
            <Text>{result.title}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">{t("Description")}</Text>
            <Text>{result.description}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">Value To Claim</Text>
            <Text>{formatUnits(result.value_to_claim, 18)}</Text>
            <Divider />
            <Text fontWeight={600} fontSize="2xl" mt="1em">{t("Transaction Hash")}</Text>
            <Text>{transactionHash}</Text>
            <Divider />
            {previewFiles && previewFiles.length > 0 && (
                <>
                    <Divider />
                    <Text fontWeight={600} fontSize="2xl" mt="1em">{t("Attached files")}</Text>
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
                    <Text fontWeight={600} fontSize="2xl" mt="1em">{t("Messages")}</Text>
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