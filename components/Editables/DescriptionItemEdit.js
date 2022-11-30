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
    EditableTextarea,
    Text,
} from '@chakra-ui/react'

const DescriptionItemEdit = ({ data }) => {

    function UpdateDescriptionItem(value) {
        console.log(value)
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
                defaultValue={data}
                fontSize='1em'
                isPreviewFocusable={false}
                onSubmit={(value) => {
                    UpdateDescriptionItem(value)
                }}
            >
                <Flex mt="1em">
                    <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Description</Text>

                    <EditableControls />
                </Flex>
                <Flex mt="1em">
                    <EditablePreview />
                    <EditableTextarea />
                </Flex>

            </Editable>
        </>
    )
}

export default DescriptionItemEdit;