import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    Button,
    Flex,
    IconButton,
    ButtonGroup,
    Text,
    useToast,
    Box,
    FormControl,
    Spinner,
    Textarea,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { itemService } from '../../services/itemService'

const DescriptionItemEdit = ({ item, token, mutate }) => {
    const toast = useToast();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [countTextarea, setCountTextarea] = useState(0);
    const MAX_TEXTAREA_LENGTH = 800;


    // Open and Close Edit
    const openEdit = () => {
        reset({
            description: item.description
        });
        setCountTextarea(item.description.length)
        setIsEditing(true);
        return
    }

    const closeEdit = () => {
        reset({
            description: item.description
        });
        setIsEditing(false);
        return
    }

    async function onSubmit(data) {
        setIsLoading(true)

        if (data && data.title !== item.title) {

            await itemService.updateItemById(item._id, {
                description: data.description
            }, token);

            await itemService.purgeItem(item.slug, token);
            mutate();

            toast({
                title: 'Edit Item',
                description: 'Data Saved successfully.',
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsEditing(false);
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
            return
        }
        setIsLoading(false)
        return
    }

    return (
        <>
            <Flex p="5px">
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Description</Text>
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
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <FormControl isRequired>
                                <Textarea
                                    placeholder="Description is required, minimum 100 characters and maximum 800 characters"
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    bg="white"
                                    {...register('description', {
                                        required: true, maxLength: 800, minLength: 100, pattern: {
                                            value: /^(?![^a-zA-Z]+$)(?!$).*$/,
                                            message: "Only numbers are not allowed"
                                        }, onChange: (e) => { setCountTextarea(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Box m="5px" fontStyle={"italic"} color={countTextarea > MAX_TEXTAREA_LENGTH ? "red" : "black"}>Characters: {countTextarea} / {MAX_TEXTAREA_LENGTH}</Box>
                                <Text color="red" m="5px">{errors.description?.type === 'pattern' && errors.description?.message}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'required' && "Description is Required"}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'minLength' && "Minimum required characters are 100"}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'maxLength' && "Maximum required characters are 800"}</Text>
                            </FormControl>

                            <Button bg="#00abd1" color="white" type="submit">
                                Save
                            </Button>
                        </form>
                    )}
                </Box>
            ) : (
                <Text p="5px"
                    mt="10px">{item.description}</Text>
            )}
        </>
    )
}

export default DescriptionItemEdit;