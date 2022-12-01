import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";

const FilesItemEdit = () => {
    const [actionEdit, setActionEdit] = useState(false);
    const [loading, setLoading] = useState(false);


    const onEdit = async () => {
        setActionEdit(true)
        setLoading(true)
        setLoading(false)
        return
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
                hola
                </>
            )}
        </>
    )
}

export default FilesItemEdit;