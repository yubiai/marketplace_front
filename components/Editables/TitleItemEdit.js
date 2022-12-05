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
} from '@chakra-ui/react'
import { itemService } from '../../services/itemService'

const TitleItemEdit = ({ item, token, mutate }) => {

    async function UpdateTitleItem(value) {
       
        if(value !== item.title){
            console.log("No es igual updateee")
            await itemService.updateItemById(item._id, {
                title: value
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
                    <EditablePreview />
                    <Input as={EditableInput} />
                </Flex>
            </Editable>
        </>
    )
}

export default TitleItemEdit;