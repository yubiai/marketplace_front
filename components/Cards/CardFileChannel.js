

const CardFileChannel = (file, i) => {

    if (!file.author && filesChannel.length > 0) {
        for (let i = 0; i < filesChannel.length; i++) {
            if (filesChannel[i]._id === file) {
                file = filesChannel[i]
                file.remove = true
            }
        }
    }

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
                {file?.remove === true && isOpen === false && (
                    <Button bg="transparent" float="right" p="1em" size="15px" onClick={() => removeFileSelected(file._id)}>
                        <SmallCloseIcon />
                    </Button>
                )}
            </Flex>

        </Stack>
    )


}
export default CardFileChannel;