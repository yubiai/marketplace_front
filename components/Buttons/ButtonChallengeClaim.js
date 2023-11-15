import React from 'react';
import { Button } from '@chakra-ui/react';
import { useGlobal } from '../../providers/globalProvider';
import { orderService } from '../../services/orderService';
import { evidenceService } from '../../services/evidenceService';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseUnits } from '@ethersproject/units';

const ButtonChallengeClaim = ({ transactionInfo, stepsPostAction, evidenceID, toggleLoadingStatus, contractAddress, yubiaiAbi, t }) => {
    const global = useGlobal();
    const { claimID, transactionHash } = transactionInfo;

    const feeArbitration = process.env.NEXT_PUBLIC_ENV == "prod" ? process.env.NEXT_PUBLIC_FEE_ARBITRATION_GNOSIS : process.env.NEXT_PUBLIC_FEE_ARBITRATION_TEST;
    const feeArbitrationToWei = parseUnits(feeArbitration.toString());

    // Write Contract
    const { data: resultChallengeClaim, write: challengeClaimWrite } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'challengeClaim',
        value: feeArbitrationToWei,
        onError(err) {
            console.error('Error accepting claim the transaction : ', err);
            toggleLoadingStatus(false);
            return
        },
    });

    // Use Wait for transaction
    useWaitForTransaction({
        hash: resultChallengeClaim?.hash,
        async onSuccess() {
            await evidenceService.updateStatus(evidenceID, {
                status: 2
            }, global?.profile?.token);

            await orderService.updateOrderStatus(transactionHash, 'ORDER_DISPUTE_IN_PROGRESS', global?.profile?.token);

            stepsPostAction();
            toggleLoadingStatus(false);
            return
        },
        onError(error) {
            console.error(error);
            return
        }
    });



    const challengeClaim = async () => {

        try {
            toggleLoadingStatus(true);

            challengeClaimWrite({
                args: [claimID]
            });

            return
        } catch (e) {
            console.error('Error accepting claim the transaction : ', e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button bg='red.400' color={'white'} w={{ base: "100%", md: "200px" }} onClick={() => challengeClaim()}>
            {t("Challenge claim")}
        </Button>
    );
};

export default ButtonChallengeClaim;
