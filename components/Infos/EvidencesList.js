import { Box } from "@chakra-ui/react";
import EvidenceListCard from "../Cards/EvidenceListCard";


const evidences = [
    {
        status: "Active",
        title: "With Coins",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    },
    {
        status: "Active",
        title: "With File fail",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    },
    {
        status: "Active",
        title: "Rock fail",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    },
    {
        status: "Active",
        title: "Feedback i dont know",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    },
    {
        status: "Active",
        title: "Feedback i dont know",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    },
    {
        status: "Active",
        title: "Feedback i dont know",
        description: "With i dont knowwwwwwwwwwwwwwwwwwwwwwwwww",
        author: "",
        files: []
    }
]

const EvidencesList = () => {

    if (!evidences && evidences.length === 0) {
        return (
            <Text>Empty</Text>
        )
    }

    return (
        <Box overflowY="auto" h="200px" position={"relative"}
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#00abd1',
                    borderRadius: '24px',
                },
            }}>
            {evidences && evidences.length > 0 && evidences.map((evidence, i) => {
                return (

                    <EvidenceListCard evidence={evidence} key={i} />
                )
            })}
        </Box>
    )
}

export default EvidencesList;