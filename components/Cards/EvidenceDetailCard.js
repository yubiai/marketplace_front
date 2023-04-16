import { Center, Divider, Link, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { dealService } from "../../services/dealService";
import { useGlobal } from "../../providers/globalProvider";
import moment from "moment";

const EvidenceDetailCard = ({claim}) => {
    const global = useGlobal();

    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(false);

    const parseWeiToTokenAmount = weiAmount => (
        (global.yubiaiPaymentArbitrableInstance || {}).web3 && parseFloat(global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(String(weiAmount)), 10) || 0);

    const getEvidence = async() => {
        try {
            setLoading(true)
            const response = await dealService.getEvidenceByClaimID(claim.claimID);
            if(response && response.data){
                setEvidence(response.data);
                setLoading(false);
                return 
            } else {
                setEvidence(null);
                setLoading(false);
                return
            }
        } catch (err){
            console.error(err);
            setEvidence(null);
            setLoading(false);
            return
        }
    }

    useEffect(() => {
        if(claim && claim.claimID){
            getEvidence()
        }
    }, [claim]);

    if (loading) return (
        <Center mt="1em">
            <Spinner />
        </Center>
    )

    if(evidence) {
        return (
            <>
                <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                <Text fontWeight={600} fontSize="2xl">Evidence - Claim ID #{evidence.claimID}</Text>
                <Text fontSize='sm'>Created At: {moment(evidence.createdAt).format('DD MMMM, YYYY h:mm:ss a')}</Text>
                <Text mt="5px" fontWeight={"bold"}>Value Claim: {parseWeiToTokenAmount(evidence.value_to_claim)}</Text>
                <Text mt="5px" fontWeight={"bold"}>Title: {evidence.title}</Text>
                <Text mt="5px" fontWeight={"bold"}>Description</Text>
                <Text>{evidence.description}</Text>
                <Text mt="5px" fontWeight={"bold"}>JSON</Text>
                <Link color="blue.700" href={process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_json} isExternal>{process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_json}</Link>
                <Text mt="5px" fontWeight={"bold"}>PDF</Text>
                <Link color="blue.700" href={process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_pdf} isExternal>{process.env.NEXT_PUBLIC_IPFS_GATEWAY + evidence.url_ipfs_pdf}</Link>
                <Text mt="5px" fontWeight={"bold"}>File Signature</Text>
                <Text >{evidence.fileSignature}</Text>
            </>
        )
    }
}

export default EvidenceDetailCard;