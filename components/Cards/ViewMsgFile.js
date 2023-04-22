import { Badge, Flex, Stack, Text, Box } from "@chakra-ui/react"
import moment from "moment"
import FileIcon from "../Infos/FileIcon"


const ViewMsgFile = (msg) => {

    return (
        <Stack
            mt="5px"
            direction={{ base: 'column', md: 'row' }}
            justifyContent="left"
        >
            <Flex>
                <FileIcon type={msg?.file?.mimetype} />
                <Box ml='3'>
                    <Flex align="center">
                    <Text fontWeight='bold' >
                        File: 
                    </Text>
                    <Text fontSize='sm'>
                    {msg.file?.filename}
                    </Text>
                    </Flex>
                    <Badge colorScheme='green'>
                        {msg?.user?.name}
                    </Badge>
                    <Text fontSize='sm'>{moment(msg?.date).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                </Box>
            </Flex>
        </Stack>
    )
}

export default ViewMsgFile;