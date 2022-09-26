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
    Avatar,
    Flex,
    Box,
    Checkbox,
    CheckboxGroup,
} from "@chakra-ui/react";
import moment from "moment";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { evidenceService } from "../../services/evidenceService";
import FileIcon from "../Infos/FileIcon";


const AddFileEvidence = ({ order, token, selectedFiles, setSelectedFiles }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State useForm
    const { handleSubmit, register } = useForm()

    const [filesChannel, setFilesChannel] = useState(null);

    const loadFiles = async () => {
        await evidenceService.getFilevidenceByOrderID(order, token)
            .then((res) => {
                setFilesChannel(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        loadFiles()
        return
    }, []);

    const handleChange = (e) => {
        setSelectedFiles(e);
        return
    }

    const onSubmitFiles = async (data) => {
        console.log(data, "data");
        console.log(filesChannel, "filesChannel")
        setSelectedFiles(data.multiple);
        onClose();
    }

    const removeFileSelected = (id) => {
        console.log(selectedFiles, "previewsds removegfile")
        console.log(id, "id removegfile")

        const result = selectedFiles.filter(e => e !== id);

        if (!result) {
            return
        }

        setSelectedFiles(result);
        return;
    }

    const cardFileChannel = (file) => {

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

    return (
        <>
            <Button mb="1em" mt="1em" onClick={() => {
                loadFiles()
                setSelectedFiles([])
                onOpen()
            }} bg="green.400" color="white">
                <ChatIcon w={6} h={6} m="4px" /> Add chat files
            </Button>

            {selectedFiles && selectedFiles.length > 0 && selectedFiles.map((file) => {
                return (
                    cardFileChannel(file)
                )
            })}

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"3xl"}>
                <ModalOverlay />
                <form id="files-form" onSubmit={handleSubmit(onSubmitFiles)}>

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