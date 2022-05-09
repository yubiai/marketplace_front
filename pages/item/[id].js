import { useRouter } from "next/router";


const ItemById = () => {

    const router = useRouter();
    const { id } = router.query;

    return (
        <>
        Item de tal: {id}
        </>
    )
}

export default ItemById;