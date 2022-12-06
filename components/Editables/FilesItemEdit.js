import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Center, Flex, IconButton, Spacer, Spinner, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit, FaTrash, FaWindowClose } from "react-icons/fa";
import { itemService } from "../../services/itemService";
import { publishService } from "../../services/publishService";
import FileUpload from "../Utils/FileUpload";
import PlayerAudioEditItem from "../Utils/PlayerAudioEditItem";
import PlayerImage from "../Utils/PlayerImage";
import PlayerVideoEditItem from "../Utils/PlayerVideoEditItem";

const FilesItemEdit = ({ item, token, mutate }) => {
    const toast = useToast();

    const { handleSubmit, getValues, setValue, control, resetField, reset } = useForm()

    const [actionEdit, setActionEdit] = useState(false);

    const [editItem0, setEditItem0] = useState(false);
    const [editItem1, setEditItem1] = useState(false);
    const [editItem2, setEditItem2] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const activeTypeFile = (file) => {

        if (file) {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
                return <PlayerImage imageSrc={file} />
            }
            if (file.mimetype === "video/mp4") {
                return <PlayerVideoEditItem videoSrc={file} />
            }
            if (file.mimetype === "audio/mpeg") {
                return <PlayerAudioEditItem audioSrc={file} />
            }
        }
    }

    const onCloseEdit = () => {
        setActionEdit(false)
        setEditItem0(false)
        setEditItem1(false)
        setEditItem2(false)
        reset()
    }

    const onEdit = async () => {
        setActionEdit(true)
        setLoading(true)
        setLoading(false)
        return
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const form = new FormData()

            if (data.file1) {
                form.append('files', data.file1)
                form.append('filespos', data.file1.name)
            } else {
                form.append('filespos', false)
            }

            if (data.file2) {
                form.append('files', data.file2)
                form.append('filespos', data.file2.name)
            } else {
                form.append('filespos', false)
            }

            if (data.file3) {
                form.append('files', data.file3)
                form.append('filespos', data.file3.name)
            } else {
                form.append('filespos', false)
            }


            await publishService.updateItemFiles(item._id,
                form,
                token
            )
            setError(null);
            mutate();
            onCloseEdit();
            toast({
                title: 'Edit Item',
                description: 'Data Saved successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
              });
            setLoading(false);
            return
        } catch (err) {
            console.error(err);
            setError("Failed to upload new file.")
            onCloseEdit()
            setLoading(false);
            return
        }

    }

    const onDeleteFile = async (file) => {
        setError(null);
        setLoading(true);
        try{
            await itemService.deleteFileById(item._id, {
                file_id: file._id
            }, token);
            
            mutate();
            onCloseEdit();
            setLoading(false);
        } catch(err){
            console.error(err);
            mutate();
            toast({
                title: 'Edit Item',
                description: 'Data Saved successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
              });
            onCloseEdit();
            setLoading(false);
            setError("Error deleting file.")
        }
    }

    return (
        <>
            <Flex mt="1em">
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Files</Text>
                <Flex justifyContent='left' m="5px">
                    {actionEdit && (
                        <ButtonGroup justifyContent='center' size='sm'>
                            <IconButton icon={<CloseIcon />} onClick={() => onCloseEdit()} />
                        </ButtonGroup>
                    )}
                    {!actionEdit && (<IconButton size='sm' icon={<EditIcon />} onClick={() => onEdit(true)} />
                    )}

                </Flex>
            </Flex>
            {loading && (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                />
            )}
            {error && (
                <Text>
                    {error}
                </Text>
            )}
            {actionEdit && !loading && (
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex display={'flex'} flexDirection={{ base: 'column', sm: 'row' }} width={'full'} color="gray.700">
                            <Box w={{ base: "full", md: "33%" }} h="300px" p="1em" mt={{ base: "4em", md: "5px" }}>
                                {item && item.files && item.files[0] && !editItem0 && (
                                    <>
                                        <Center>
                                            <Text fontWeight='semibold'>Main Image</Text>
                                        </Center>
                                        {activeTypeFile(item.files[0])}
                                        <Center mt="10px">
                                            <Button backgroundColor={'#00abd1'}
                                                color={'white'} onClick={() => {
                                                    setEditItem0(true)
                                                }}><FaRegEdit /></Button>
                                        </Center>
                                    </>
                                )}
                                {editItem0 || item.files && !item.files[0] ? (
                                    <>
                                        <FileUpload
                                            name="file1"
                                            acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp"
                                            isRequired={true}
                                            placeholder="Your File 1"
                                            control={control}
                                            resetField={resetField}
                                            getValues={getValues}
                                        >
                                            Main Image {editItem0 && item.files && item.files[0] && (
                                                <Button position="absolute" top="0" right="15" float="right" onClick={() => {
                                                    setEditItem0(false)
                                                    setValue("file1", "")
                                                }}><FaWindowClose /></Button>
                                            )}
                                        </FileUpload>
                                    </>
                                ) : null}
                            </Box>
                            <Box w={{ base: "full", md: "33%" }} h="300px" p="1em" mt={{ base: "4em", md: "5px" }}>
                                {item && item.files && item.files[1] && !editItem1 && (
                                    <>
                                        <Center>
                                            <Text fontWeight='semibold'>File 2</Text>
                                        </Center>
                                        {activeTypeFile(item.files[1])}
                                        <Flex mt="10px">
                                            <Center>
                                                <Button backgroundColor={'#00abd1'}
                                                    color={'white'} onClick={() => {
                                                        setEditItem1(true)
                                                    }}><FaRegEdit /></Button>
                                            </Center>
                                            <Spacer />
                                            <Button bg="red.400" color="white" onClick={() => {
                                                onDeleteFile(item.files[1])
                                            }}><FaTrash fontSize="1em" />
                                            </Button>
                                        </Flex>
                                    </>
                                )}
                                {editItem1 || item.files && !item.files[1] ? (
                                    <>
                                        <FileUpload
                                            name="file2"
                                            acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
                                            isRequired={false}
                                            placeholder="Your File 2"
                                            control={control}
                                            resetField={resetField}
                                            getValues={getValues}
                                        >
                                            File 2 {editItem1 && item.files && item.files[1] && (
                                                <Button position="absolute" top="0" right="15" float="right" onClick={() => {
                                                    setEditItem1(false)
                                                    setValue("file2", "")
                                                }}><FaWindowClose /></Button>
                                            )}
                                        </FileUpload>
                                    </>
                                ) : null}
                            </Box>
                            <Box w={{ base: "full", md: "33%" }} h="300px" p="1em" mt={{ base: "4em", md: "5px" }}>
                                {item && item.files && item.files[2] && !editItem2 && (
                                    <>
                                        <Center>
                                            <Text fontWeight='semibold'>File 3</Text>
                                        </Center>

                                        {activeTypeFile(item.files[2])}
                                        <Flex mt="10px">
                                            <Center>
                                                <Button backgroundColor={'#00abd1'}
                                                    color={'white'} onClick={() => {
                                                        setEditItem2(true)
                                                    }}><FaRegEdit /></Button>
                                            </Center>
                                            <Spacer />
                                            <Button bg="red.400" color="white" onClick={() => {
                                                onDeleteFile(item.files[2])
                                            }}><FaTrash fontSize="1em" />
                                            </Button>
                                        </Flex>
                                    </>
                                )}
                                {editItem2 || item.files && !item.files[2] ? (
                                    <>
                                        <FileUpload
                                            name="file3"
                                            acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
                                            isRequired={false}
                                            placeholder="Your File 3"
                                            control={control}
                                            resetField={resetField}
                                            getValues={getValues}
                                        >
                                            File 3
                                            {editItem2 && item.files && item.files[2] && (
                                                <Button position="absolute" top="0" right="15" float="right" onClick={() => {
                                                    setEditItem2(false)
                                                    setValue("file3", "")
                                                }}><FaWindowClose /></Button>
                                            )}
                                        </FileUpload>
                                    </>
                                ) : null}
                            </Box>
                        </Flex>
                        <Button float="right" mt="5em" bg="#00abd1" color="white" type="submit" disabled={!getValues("file1") && !getValues("file2") && !getValues("file3")}>
                            Update
                        </Button>
                    </form>
                </>
            )
            }
        </>
    )
}

export default FilesItemEdit;