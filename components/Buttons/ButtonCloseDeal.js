import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { orderService } from '../../services/orderService';
import { useGlobal } from '../../providers/globalProvider';
import { useRouter } from 'next/router';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

const ButtonCloseDeal = ({ dealId, transactionHash, toggleLoadingStatus, contractAddress, yubiaiAbi, stepsPostAction, t }) => {
    const global = useGlobal();
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);

    const { data: resultCloseDeal, write: writeCloseDeal } = useContractWrite({
        address: contractAddress,
        abi: yubiaiAbi,
        functionName: 'closeDeal',
        args: [dealId]
    })

    useWaitForTransaction({
        hash: resultCloseDeal?.hash,
        async onSuccess() {
            await orderService.updateOrderStatus(transactionHash, 'ORDER_CLOSE_DEAL', global.profile.token);

            stepsPostAction();
            toggleLoadingStatus(false);
            return
        },
        onError(error) {
            console.error('Error close deal the transaction : ', error);
            toggleLoadingStatus(false);
            return
        }
    });

    const closeDeal = async () => {

        if (!global.profile.token || !transactionHash || !dealId) {
            router.push("/logout");
            return
        }

        try {
            setIsDisabled(true);
            toggleLoadingStatus(true)
            writeCloseDeal()
            return
        } catch (e) {
            console.error('Error close deal the transaction : ', e);
            toggleLoadingStatus(false);
            return
        }
    }

    return (
        <Button isDisabled={isDisabled} bg='#00abd1' w={{ base: "100%", md: "200px" }} _hover={{
            bg: "blue.300"
        }} color={'white'} onClick={() => { closeDeal() }}>
            {t("Claim Payment")}
        </Button>
    );
};

export default ButtonCloseDeal;
