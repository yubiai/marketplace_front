import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "../Utils/FileUpload";

const FilesItemEdit = ({files}) => {
    const { handleSubmit, control, resetField } = useForm()

    const [actionEdit, setActionEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const onEdit = async () => {
        setActionEdit(true)
        setLoading(true)
        setLoading(false)
        return
    }

    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <>
            <Flex mt="1em">
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Files</Text>
                <Flex justifyContent='left' m="5px">
                    {actionEdit && (
                        <ButtonGroup justifyContent='center' size='sm'>
                            <IconButton icon={<CloseIcon />} onClick={() => setActionEdit(false)} />
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
            {actionEdit && (
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex display={'flex'} flexDirection={{ base: 'column', sm: 'row' }} width={'full'} color="gray.700">
                            <FileUpload
                                name="file1"
                                acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp"
                                isRequired={true}
                                placeholder="Your File 1"
                                control={control}
                                resetField={resetField}
                                fileExist={files && files[0]}
                            >
                                Main Image
                            </FileUpload>
                            <FileUpload
                                name="file2"
                                acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
                                isRequired={false}
                                placeholder="Your File 2"
                                control={control}
                                resetField={resetField}
                                fileExist={files && files[1]}
                            >
                                File
                            </FileUpload>
                            <FileUpload
                                name="file3"
                                acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
                                isRequired={false}
                                placeholder="Your File 3"
                                control={control}
                                resetField={resetField}
                                fileExist={files && files[2]}
                            >
                                File
                            </FileUpload>
                        </Flex>
                        <Button float="right" mt="3em" bg="#00abd1" color="white" type="submit">
                                Update
                            </Button>
                    </form>
                </>
            )}
        </>
    )
}

export default FilesItemEdit;