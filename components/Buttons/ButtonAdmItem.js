import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { itemService } from "../../services/itemService";
import { publishService } from "../../services/publishService";

const ButtonAdmItem = ({ item, token, mutate, loading, setLoading, t }) => {

    // Status:
    // 1: Inactivo en revision - 2: Activo - 3: Inactivo

    const router = useRouter()

    const ReviewItem = async () => {
        //To review
        setLoading(true)
        await publishService.updateStatusItem(item._id, {
            status: 1
        }, token);
        await mutate();
        await itemService.purgeItem(item.slug, token);
        setLoading(false);
        return
    }

    const UnpublishItem = async () => {
        //To unpublish
        setLoading(true)
        await publishService.updateStatusItem(item._id, {
            status: 3
        }, token);
        await mutate();
        await itemService.purgeItem(item.slug, token);
        setLoading(false);
        return
    }

    return (
        <Menu>
            <MenuButton as={Button} w={{ base: 'full', sm: '374px', md: '262px' }} disabled={loading || item.status == 1} backgroundColor={'#00abd1'} _hover={{
                bg: "blue.300"
            }}
                color={'white'} rightIcon={<ChevronDownIcon />}>
                {t("Actions")}
            </MenuButton>
            <MenuList>
                {item.status == 1 && item.published == false && (
                    <MenuItem onClick={() => UnpublishItem()}>{t("Cancel Review")}</MenuItem>

                )}
                {item.status == 2 && item.published == true && (
                    <MenuItem onClick={() => UnpublishItem()}>{t("Unpublish")}</MenuItem>

                )}
                {item.status == 3 && item.published == false && (
                    <>
                        <MenuItem onClick={() => router.push(`/profile/listings/edit/${item._id}`)}>{t("Edit listing")}</MenuItem>
                        <MenuItem onClick={() => ReviewItem()}>{t("Send for review")}</MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    )
}

export default ButtonAdmItem;