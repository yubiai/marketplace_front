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

const DescriptionItemEdit = ({ item, token, mutate, t }) => {
    const toast = useToast();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [countDescription, setCountDescription] = useState(0);
    const MIN_DESCRIPTION_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 1600;


    // Open and Close Edit
    const openEdit = () => {
        reset({
            description: item.description
        });
        setCountDescription(item.description.length)
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
                title: t("Edit Item"),
                description: t("Data Saved successfully."),
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
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <FormControl isRequired>
                                <Textarea
                                    placeholder={t(`Description is required, minimum ${MIN_DESCRIPTION_LENGTH} characters and maximum ${MAX_DESCRIPTION_LENGTH} characters`)}
                                    _placeholder={{ color: 'gray.400' }}
                                    color="gray.700"
                                    bg="white"
                                    {...register('description', {
                                        required: true, maxLength: MAX_DESCRIPTION_LENGTH, minLength: MIN_DESCRIPTION_LENGTH, onChange: (e) => { setCountDescription(e.target.value.length) }
                                    })}
                                    isRequired
                                />
                                <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countDescription}</Text> / {MAX_DESCRIPTION_LENGTH}</Flex>
                                <Text color="red" m="5px">{errors.description?.type === 'pattern' && errors.description?.message}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'required' && t("Description is Required")}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'minLength' && t("Minimum required characters are 100")}</Text>
                                <Text color="red" m="5px">{errors.description?.type === 'maxLength' && t("Maximum required characters are 800")}</Text>
                            </FormControl>

                            <Button bg="#00abd1" color="white" type="submit">
                                {t("Save")}
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