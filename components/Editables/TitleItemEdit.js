import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    Editable,
    EditableInput,
    EditablePreview,
    useEditableControls,
    Input,
    Flex,
    IconButton,
    ButtonGroup,
    Text,
    useToast,
    Box,
} from '@chakra-ui/react'
import { itemService } from '../../services/itemService'

const TitleItemEdit = ({ item, token, mutate }) => {
    const toast = useToast();

    async function UpdateTitleItem(value) {

        if (value !== item.title) {

            await itemService.updateItemById(item._id, {
                title: value
            }, token);

            await itemService.purgeItem(item.slug, token);

            toast({
                title: 'Edit Item',
                description: 'Data Saved successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            mutate();
            return
        }
        return
    }

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        return isEditing ? (
            <ButtonGroup m="10px" justifyContent='center' size='sm'>
                <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
                <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='left' m="5px">
                <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
            </Flex>
        )
    }

    return (
        <>
            <Editable
                textAlign='left'
                defaultValue={item.title}
                fontSize='1em'
                isPreviewFocusable={false}
                onSubmit={(value) => {
                    UpdateTitleItem(value)
                }}
            >
                <Flex>
                    <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Title</Text>
                    <EditableControls />
                </Flex>
                <Flex>
                    <Box width={"100%"}>
                        <EditablePreview />
                    </Box>
                    <Input as={EditableInput} />
                </Flex>
            </Editable>
        </>
    )
}

export default TitleItemEdit;