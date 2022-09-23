import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";


const EvidenceDetail = () => {
    const router = useRouter()

    const { id } = router.query;

    console.log(id);

    return(
        <>
            <Text>Evidence ID: {id}</Text>
        </>
    )
    
}

export default EvidenceDetail;