import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    Editable,
    EditablePreview,
    useEditableControls,
    Flex,
    IconButton,
    ButtonGroup,
    EditableTextarea,
    Text,
    useToast,
    Box,
} from '@chakra-ui/react'
import { itemService } from '../../services/itemService'

const DescriptionItemEdit = ({ item, token, mutate }) => {
    const toast = useToast();

    async function UpdateDescriptionItem(value) {
        if (value !== item.description) {
            await itemService.updateItemById(item._id, {
                description: value
            }, token)
            toast({
                title: 'Edit Item',
                description: 'Data Saved successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            mutate();
        }
    }

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

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
                defaultValue={item && item.description}
                fontSize='1em'
                p="5px"
                isPreviewFocusable={false}
                onSubmit={(value) => {
                    UpdateDescriptionItem(value)
                }}
            >
                <Flex>
                    <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Description</Text>
                    <EditableControls />
                </Flex>
                <Flex>
                    <Box>
                        <EditablePreview />
                    </Box>
                    <EditableTextarea />
                </Flex>

            </Editable>
        </>
    )
}

export default DescriptionItemEdit;