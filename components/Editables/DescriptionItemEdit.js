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
} from '@chakra-ui/react'
import { itemService } from '../../services/itemService'

const DescriptionItemEdit = ({ item, token, mutate }) => {

    async function UpdateDescriptionItem(value) {
        if(value !== item.description){
            await itemService.updateItemById(item._id, {
                description: value
            }, token)
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
                    <EditablePreview />
                    <EditableTextarea />
                </Flex>

            </Editable>
        </>
    )
}

export default DescriptionItemEdit;