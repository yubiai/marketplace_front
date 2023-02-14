import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, Center, Container, Divider, Heading, Spinner, Stack, StackDivider, Text } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CategoriesItemEdit from "../../../../components/Editables/CategoriesItemEdit";
import DescriptionItemEdit from "../../../../components/Editables/DescriptionItemEdit";
import FilesItemEdit from "../../../../components/Editables/FilesItemEdit";
import PriceItemEdit from "../../../../components/Editables/PriceItemEdit";
import TitleItemEdit from "../../../../components/Editables/TitleItemEdit";
import ProfileMenu from "../../../../components/Menus/ProfileMenu";
import Loading from "../../../../components/Spinners/Loading";
import useFetch from "../../../../hooks/data/useFetch";
import useUser from "../../../../hooks/data/useUser";
import { useGlobal } from "../../../../providers/globalProvider";
import Error from '../../../../components/Infos/Error';
import useTranslation from 'next-translate/useTranslation';

const EditItem = () => {
    const global = useGlobal()
    const router = useRouter()
    const { t } = useTranslation("edititem");
    const { item_id } = router.query;

    const { user, loggedOut } = useUser()

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router])

    const {
        data: item,
        isLoading,
        isError,
        mutate
    } = useFetch(
        global && global.profile && global.profile.token && item_id
            ? `/items/item/id/${item_id}`
            : null,
        global && global.profile && global.profile.token
    )

    if (isLoading && !item || !user) return <Loading />

    if (isError) {
        return <Error error={isError?.message} />
    }

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Notifications </title>
                <meta
                    name="keywords"
                    content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
                />
            </Head>
            <ProfileMenu>
                <Container
                    maxW="6xl"
                    h={'full'}
                    display={'flex'}
                    flexDirection={'column'}
                    color="black"
                >
                    <Breadcrumb spacing='8px' mt='1em' mb='1em' separator={<ChevronRightIcon color='gray.500' />}>
                        <BreadcrumbItem>
                            <Link href="/" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                                textDecoration: "underline"
                            }}>{t("Home")}</Text></Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
                                <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>{t("Profile")}</Text>
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <Link href="/profile/listings" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
                                <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>{t("Listings")}</Text>
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <Text>{t("Edit Item")}</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    {!item && (
                        <Center>
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                size="md"
                            />
                        </Center>
                    )}

                    {item && user && (item.seller == user.id) ? (
                        <Stack
                            borderWidth="1px"
                            borderRadius="lg"
                            width={'full'}
                            height={'full'}
                            direction={{ base: 'column' }}
                            bg={'white'}
                            boxShadow={'2xl'}
                            padding={4}
                        >
                            <Stack divider={<StackDivider />} spacing='4' width={"100%"}>
                                <Heading size="md">{t("Edit Item")}</Heading>
                            </Stack>
                            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                            <Stack>
                                <Box>
                                    <Text fontWeight={"semibold"} fontStyle={"italic"} mt="1em">{t("CreatedAt")} {moment(item.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                                    <Text fontWeight={"semibold"} fontStyle={"italic"} mt="1em" mb="1em">{t("UpdatedAt")} {moment(item.updatedAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                                    <Box>                                    
                                        <TitleItemEdit item={item} token={global.profile.token} mutate={mutate} t={t} />
                                        <DescriptionItemEdit item={item} token={global.profile.token} mutate={mutate} t={t} />
                                    </Box>
                                    <CategoriesItemEdit item={item} token={global.profile.token} mutate={mutate} t={t} />
                                    <PriceItemEdit item={item} token={global.profile.token} mutate={mutate} t={t} />
                                    <FilesItemEdit item={item} token={global.profile.token} mutate={mutate} t={t} />
                                </Box>
                            </Stack>
                        </Stack>
                    ) : (
                        <Error error={t("This item is not your property.")} />
                    )}

                </Container>
            </ProfileMenu>
        </>
    )
}

export default EditItem;