import { Box, Text } from "@chakra-ui/react";
import EvidenceListCard from "../Cards/EvidenceListCard";

const EvidencesList = ({evidences}) => {

    if (!evidences) {
        return (
            <Text>Empty</Text>
        )
    }

    return (
        <Box overflowY="auto" maxH="200px" position={"relative"}
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