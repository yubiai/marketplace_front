import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    Button,
    Input,
    Flex,
    IconButton,
    ButtonGroup,
    Text,
    useToast,
    Box,
    FormControl,
    Spinner,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { itemService } from '../../services/itemService'

const TitleItemEdit = ({ item, token, mutate }) => {
    const toast = useToast();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [countTitle, setCountTitle] = useState(0);
    const MIN_TITLE_LENGTH = 15;
    const MAX_TITLE_LENGTH = 72;


    // Open and Close Edit
    const openEdit = () => {
        reset({
            title: item.title
        });
        setCountTitle(item.title.length)
        setIsEditing(true);
        return
    }

    const closeEdit = () => {
        reset({
            title: item.title
        });
        setIsEditing(false);
        return
    }

    async function onSubmit(data) {
        console.log(data, "data")
        setIsLoading(true)

        if (data && data.title !== item.title) {

            await itemService.updateItemById(item._id, {
                title: data.title
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
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>Title</Text>
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
                            <FormControl isRequired >
                                <Input
                                    placeholder="Title is required, minimum 15 characters and maximum 72 characters."
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    bg="white"
                                    {...register('title', {
                                        required: true, minLength: MIN_TITLE_LENGTH, maxLength: MAX_TITLE_LENGTH, pattern: {
                                            value: /^(?![^a-zA-Z]+$)(?!$).*$/,
                                            message: "Only numbers are not allowed"
                                        }, onChange: (e) => { setCountTitle(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>Characters: <Text color={countTitle < MIN_TITLE_LENGTH || countTitle > MAX_TITLE_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countTitle}</Text> / {MAX_TITLE_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.title?.type === 'pattern' && errors.title?.message}</Text>
                                <Text color="red" m="5px">{errors.title?.type === 'required' && "Title is required"}</Text>
                                <Text color="red" m="5px">{errors.title?.type === 'minLength' && "Minimum required characters are 15"}</Text>
                                <Text color="red" m="5px">{errors.title?.type === 'maxLength' && "Maximum required characters are 72"}</Text>
                            </FormControl>
                            <Button bg="#00abd1" color="white" type="submit">
                                Save
                            </Button>
                        </form>
                    )}
                </Box>
            ) : (
                <Text p="5px"
                    mt="10px">{item.title}</Text>
            )}
        </>
    )
}

export default TitleItemEdit;