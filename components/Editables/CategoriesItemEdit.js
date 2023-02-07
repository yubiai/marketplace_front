import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Divider, Flex, FormControl, FormLabel, IconButton, Select, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { itemService } from "../../services/itemService";
import { getListCategory, getListSubCategory } from "../../utils/itemUtils";


const CategoriesItemEdit = ({ item, token, mutate, t }) => {
    const toast = useToast();

    // State useForm
    const { handleSubmit, register, reset } = useForm()

    const [actionEdit, setActionEdit] = useState(false);
    const [categories, setCategories] = useState(null);
    const [subCategories, setSubCategories] = useState(null);

    const onEdit = async () => {
        // Get Categories
        const listCategories = await getListCategory();
        if (listCategories.status === 200 && listCategories.data) {
            setCategories(listCategories.data)
        }
        setActionEdit(true);
    }

    const getSubCategories = (categoryId) => {
        // Get SubCategories
        if (categoryId) {
            getListSubCategory(categoryId).then((res) => {
                let subcategories = res.data
                if (subcategories.length > 0) {
                    setSubCategories(subcategories)
                }
            })
        } else {
            setSubCategories([])
        }
    }

    const onSubmit = async (data) => {
        try {
            const newData = {
                category: data.category,
                subcategory: data.subcategory
            }
            await itemService.updateItemById(item._id, newData, token);
            toast({
                title: t("Edit Item"),
                description: t("Data Saved successfully."),
                position: 'top-right',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            mutate();
            reset();
            setActionEdit(false);
            return
        } catch (err) {
            console.error(err);
            reset()
            setActionEdit(false);
        }
    }

    return (
        <>
            <Flex mt="10px" p="5px">
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>{t("Category - Sub category")}</Text>
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
            {!actionEdit && (<Text p="5px"
            >{item.category.title}  {" - " + item.subcategory.title}</Text>)}

            {actionEdit && (
                <>
                    <Box h="full" p="5px">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {categories && categories.length > 0 && (
                                <Box mt="1em">
                                    <FormControl isRequired>
                                        <FormLabel color="black"> {t("Category")}</FormLabel>
                                        <Select
                                            bg="white"
                                            color="black"
                                            name="category"
                                            id="category"
                                            placeholder={t("Select Category")}
                                            _placeholder={{ color: 'gray.400' }}
                                            isRequired={true}
                                            {...register('category', {
                                                required: true,
                                                onChange: (e) => {
                                                    getSubCategories(e.target.value)
                                                },
                                            })}
                                        >
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id} id="category">
                                                    {category.title}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                            {subCategories && subCategories.length > 0 && (
                                <Box mt="1em">
                                    <FormControl isRequired>
                                        <FormLabel color="black">{t("Sub Category")}</FormLabel>
                                        <Select
                                            bg="white"
                                            color="black"
                                            name="subcategory"
                                            id="subcategory"
                                            placeholder={t("Select Sub Category")}
                                            _placeholder={{ color: 'gray.400' }}
                                            isRequired={true}
                                            {...register('subcategory', { required: true })}
                                        >
                                            {subCategories.map((subcategory) => {
                                                subcategory = {...subcategory,
                                                    title:  t(subcategory.title)

                                                }
                                                return  (
                                                    <option
                                                        key={subcategory._id}
                                                        value={subcategory._id}
                                                        id="subcategory"
                                                    >
                                                        {subcategory.title}
                                                    </option>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                    <Divider />
                                </Box>
                            )}
                            <Button mt="1em" bg="#00abd1" color="white" type="submit">
                                {t("Update")}
                            </Button>
                        </form>
                    </Box>
                </>
            )}
        </>
    )
}

export default CategoriesItemEdit;