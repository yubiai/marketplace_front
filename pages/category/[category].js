import { useRouter } from "next/router";


const ItemsByCategory = () => {

    const router = useRouter();
    const { category } = router.query;

    // Si no existe category error

    return (
        <>
        Listado de Publicaciones de la Categoria: {category}
        </>
    )
}

export default ItemsByCategory;