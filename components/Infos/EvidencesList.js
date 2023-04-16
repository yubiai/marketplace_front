import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { evidenceService } from "../../services/evidenceService";
import moment from "moment";
import { useRouter } from "next/router";

const EvidencesList = ({ dealId, token }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [evidences, setEvidences] = useState(null);

    const getEvidences = async () => {
        try {
            setLoading(true)
            const response = await evidenceService.getEvidencesByDealId(dealId, token);
            if (response && response.data) {
                setEvidences(response.data);
                setLoading(false);
                return
            } else {
                setEvidences(null);
                setLoading(false);
                return
            }
        } catch (err) {
            console.error(err);
            setEvidences(null);
            setLoading(false);
            return
        }
    }

    useEffect(() => {
        if (dealId) {
            getEvidences();
        }
    }, [dealId]);

    if (loading) return (
        <Center mt="1em">
            <Spinner />
        </Center>
    )

    if (evidences && evidences.length > 0) {
        return (
            <>
                <Accordion mt="2em" allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    Evidences ({evidences.length})
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {evidences.map((evidence, i) => {
                                console.log(evidence, "evidences")
                                return (
                                    <Box key={i} p="1em" m="1em" bg="blue.400" color="white" rounded="2xl" _hover={{
                                        bg: "blue.200"
                                    }} onClick={() => router.push(`/deal/claim/${evidence.claimID}`)} cursor={"pointer"}  >
                                        <Flex>
                                        Claim ID # {evidence.claimID} - {moment(evidence.updatedAt).format('DD MMMM, YYYY h:mm:ss a')}
                                        </Flex>
                                    </Box>
                                )
                            })}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </>
        )
    }


}

export default EvidencesList;