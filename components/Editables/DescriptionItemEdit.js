import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    Button,
    Flex,
    IconButton,
    ButtonGroup,
    Text,
    useToast,
    Box,
    Spinner,
    Heading,
} from '@chakra-ui/react'
import { useState } from 'react';
import { itemService } from '../../services/itemService';
import EditorRead from '../Editor/EditorRead';
import Editor from '../Editor/Editor';

const DescriptionItemEdit = ({ item, token, mutate, t }) => {
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [contentDescription, setContentDescription] = useState(null);
    const [contentDescriptionStringfy, setContentDescriptionStringfy] = useState(null);
    const [countDescription, setCountDescription] = useState(0);
    const MIN_DESCRIPTION_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 1600;
    
    // Open and Close Edit
    const openEdit = () => {
        setIsEditing(true);
        console.log(item.description, "item.description")
        setContentDescription(item.description)
        return
    }

    const closeEdit = () => {
        setContentDescription(item.description)
        setIsEditing(false);
        return
    }

    async function onSaveDescription() {
        setIsLoading(true)
        console.log(contentDescription, "contentDescription")
        if (!contentDescription || countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH) {
            toast({
                title: t("Error Form"),
                description: t("There is an error in the form"),
                position: 'top-right',
                status: 'warning',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false)
            return
        }

        try {
            await itemService.updateItemById(item._id, {
                description: contentDescription,
                descriptionString: contentDescriptionStringfy
            }, token);

            await itemService.purgeItem(item.slug, token);
            mutate();

            toast({
                title: t("Edit Item"),
                description: t("Data Saved successfully."),
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setTimeout(() => {
                setIsEditing(false);
                setIsLoading(false)
            }, 2000);
            return
        } catch (error) {
            console.error(error);
            return
        }
    }

    return (
        <>
            <Flex p="5px">
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>{t("Description")}</Text>
                {isEditing ? (
                    <ButtonGroup m="5px" justifyContent='center' size='sm'>
                        <IconButton icon={<CloseIcon />} onClick={() => closeEdit()} />
                    </ButtonGroup>
                ) : (
                    <Flex justifyContent='left' m="2px">
                        <IconButton size='sm' icon={<EditIcon />} onClick={() => openEdit()} />
                    </Flex>
                )}
            </Flex>

            {isEditing ? (
                <Box p="5px">

                    {isLoading ? (
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="md"
                        />
                    ) : (
                        <Box mt="1em">
                            <Heading as='h4' size='md'>{t("Description")} <span style={{ color: 'orange.500' }}>*</span></Heading>
                            <Editor setContent={setContentDescription} setContentStringfy={setContentDescriptionStringfy} setCount={setCountDescription} content={contentDescription} />
                            <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH ? "orange.500" : "green"} mr="5px" ml="5px">{countDescription}</Text> / {MAX_DESCRIPTION_LENGTH}</Flex>
                            <Text color="orange.500" m="5px">{countDescription < MIN_DESCRIPTION_LENGTH && countDescription > 1 && t("Minimum required characters are 100")}</Text>
                            <Text color="orange.500" m="5px">{countDescription > MAX_DESCRIPTION_LENGTH && t("Maximum required characters are 1600")}</Text>
                            <Button bg="#00abd1" color="white" onClick={() => { onSaveDescription() }}>
                                {t("Save")}
                            </Button>
                        </Box>
                    )}
                </Box>
            ) : (
                <>

                    <EditorRead content={item.description} />
                </>
            )}
        </>
    )
}

export default DescriptionItemEdit;