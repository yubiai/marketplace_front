import { Badge, Flex, Stack, Text, Box } from "@chakra-ui/react"
import moment from "moment"
import { FaFileAlt } from "react-icons/fa"

const ViewMsgText = (msg) => {
    return (
        <Stack
            mt="5px"
            direction={{ base: 'column', md: 'row' }}
            justifyContent="left"
        >
            <Flex>
                <FaFileAlt size={'2.5em'} />

                <Box ml='3'>
                    <Flex align="center">
                        <Text fontWeight='bold' fontSize='md' >
                            Texxt:
                        </Text>
                        <Text fontSize='sm' ml="5px">
                            {msg?.text}
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

export default ViewMsgText;