import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Center, Menu, MenuButton, MenuItem, MenuList, Spinner } from "@chakra-ui/react";
import { publishService } from "../../services/publishService";

const ButtonAdmItem = ({ item, token, mutate, loading, setLoading }) => {
    console.log(item)

    const ReviewItem = async () => {
        console.log("publish")
        //To review
        setLoading(true)
        await publishService.updateStatusItem(item._id, {
            status: 1
        }, token)
        await mutate()
        setLoading(false)
        return
    }

    const UnpublishItem = async () => {
        console.log("Unpublish")
        //To unpublish
        setLoading(true)
        await publishService.updateStatusItem(item._id, {
            status: 3
        }, token);
        await mutate();
        setLoading(false)
        return
    }

    const EditItem = () => {
        console.log("Edit Item")
        return
    }

    return (
        <Menu>
            <MenuButton as={Button} w={{ base: '374px', sm: '374px', md: '262px' }} disabled={loading || item.status == 1} backgroundColor={'#00abd1'} _hover={{
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
                        <MenuItem onClick={() => EditItem()}>Edit</MenuItem>
                        <MenuItem onClick={() => ReviewItem()}>Send for review</MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    )
}

export default ButtonAdmItem;