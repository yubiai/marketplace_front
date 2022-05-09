import { useRouter } from "next/router";


const UserProfile = () => {

    const router = useRouter();
    const { id } = router.query;

    return (
        <>
        Perfil de tal usuario: {id}
        </>
    )
}

export default UserProfile;