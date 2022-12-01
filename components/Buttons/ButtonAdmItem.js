import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { itemService } from "../../services/itemService";
import { publishService } from "../../services/publishService";

const ButtonAdmItem = ({ item, token, mutate, loading, setLoading }) => {

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
                Actions
            </MenuButton>
            <MenuList>
                {item.status == 2 && item.published == true && (
                    <MenuItem onClick={() => UnpublishItem()}>Unpublish</MenuItem>

                )}
                {item.status == 3 && item.published == false && (
                    <>
                        <MenuItem onClick={() => router.push(`/profile/listings/`)} isDisabled={true}>Edit listing</MenuItem>
                        <MenuItem onClick={() => ReviewItem()}>Send for review</MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    )
}

export default ButtonAdmItem;