import { ChatIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
    Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Stack,
    Badge,
    Flex,
    Box,
    Checkbox,
    CheckboxGroup,
} from "@chakra-ui/react";
import moment from "moment";
import { useForm } from "react-hook-form";
import FileIcon from "../Infos/FileIcon";


const AddFileEvidence = ({ filesChannel, selectedFiles, setSelectedFiles }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State useForm
    const { register } = useForm()

    const handleChange = (elements) => {
        let files = [];
        for (let i = 0; i < elements.length; i++) {
            let result = filesChannel.find((file) => file._id === elements[i])
            if(result){
                files.push(result);
            }
        }

        setSelectedFiles(files)
        return
    }

    const removeFileSelected = (id) => {

        const result = selectedFiles.filter(e => e._id !== id);

        if (!result) {
            return
        }

        setSelectedFiles(result);
        return;
    }

    const cardFileChannel = (file, i) => {

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
                justifyContent="left"
                >
                <Flex>
                    <FileIcon type={file?.mimetype} />
                    <Box ml='3'>
                        <Text fontWeight='bold' fontSize='sm'>
                            {file?.filename}
                            <Badge ml='1' colorScheme='green'>
                                {file?.author.name}
                            </Badge>
                        </Text>
                        <Text fontSize='sm'>{moment(file?.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                    </Box>
                    {isOpen === false && (
                        <Button bg="transparent" float="right" p="1em" size="15px" onClick={() => removeFileSelected(file._id)}>
                            <SmallCloseIcon />
                        </Button>
                    )}
                </Flex>
            </Stack>
        )
    }

    return (
        <>
            <Button mb="1em" mt="1em" onClick={() => {
                onOpen()
            }} bg="green.400" color="white">
                <ChatIcon w={6} h={6} m="4px" /> Add chat files
            </Button>

            {selectedFiles && selectedFiles.length > 0 && selectedFiles.map((file, i) => {
                return (
                    cardFileChannel(file, i)
                )
            })}

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"3xl"}>
                <ModalOverlay />
                <form>

                    <ModalContent>
                        <ModalHeader>List files</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <CheckboxGroup onChange={handleChange} colorScheme='green'>
                                {filesChannel && filesChannel.length > 0 && (
                                    filesChannel.map((file, i) => {
                                        return (
                                            <Checkbox value={file._id} key={i} {...register('multiple')}>
                                                {cardFileChannel(file)}
                                            </Checkbox>
                                        )
                                    })
                                )}
                            </CheckboxGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}

export default AddFileEvidence;