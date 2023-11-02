import { usePrepareContractWrite } from 'wagmi';
import { yubiaiArbitrable } from './abis';


export function createDealCheckout(yubiaiContract, token, extraBurnFee, timeForService, timeForClaim, buyer, seller, amount, termsUrl) {

    //Preparando el contrato
    const { config } = usePrepareContractWrite({
        address: yubiaiContract.yubiaiArbitrable,
        abi: yubiaiArbitrable,
        functionName: 'createDealWithValue',
        account: buyer,
        args: [
            amount,
            buyer,
            0,
            extraBurnFee * 100,
            0,
            0,
            seller,
            Math.floor((new Date()).getTime() / 1000),
            timeForService,
            timeForClaim,
            token,
            0,
            0
        ], termsUrl
    });

    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return data;
}

export const useCreateDealHook = async (useContractWrite, yubiaiContract, token, extraBurnFee, timeForService, timeForClaim, buyer, seller, amount, termsUrl) => {

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: yubiaiContract.yubiaiArbitrable,
        abi: yubiaiArbitrable,
        functionName: 'createDealWithValue',
        account: buyer,
        args: [
            amount,
            buyer,
            0,
            extraBurnFee * 100,
            0,
            0,
            seller,
            Math.floor((new Date()).getTime() / 1000),
            timeForService,
            timeForClaim,
            token,
            0,
            0
        ], termsUrl,
        onError(error) {
            console.log('Error', error)
        },
    });

    const { data: dati, isError } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: data => {
            console.log(data, "dataaa1")
        },
        onError: (err) => {
            console.error(err, "err2")
        },
    })


    write();

    return {
        data: dati
    }
}
