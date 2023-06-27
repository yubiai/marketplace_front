import { prepareWriteContract, writeContract } from '@wagmi/core'
import { yubiaiArbitrable } from '../../utils/escrow-utils/abis';

const useContractWriteHook = async ( senderWallet, amountToWei, recipient ) => {
    console.log(senderWallet, amountToWei, recipient, "arranco use contrac write")
    const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

    const config = await prepareWriteContract({
        address: '0x3C8be116dA439ee473ef20d10058b0c99eC9Bd70',
        abi: yubiaiArbitrable,
        functionName: 'createDealWithValue',
        args: [
            [
                String(amountToWei),
                senderWallet,
                0,
                0,
                0,
                0,
                recipient,
                Math.floor((new Date()).getTime() / 1000),
                process.env.NEXT_PUBLIC_TIME_FOR_SERVICE,
                process.env.NEXT_PUBLIC_TIME_FOR_CLAIM,
                NULL_ADDRESS,
                0,
                0
            ], process.env.NEXT_PUBLIC_TERMS_URL_DEFAULT
        ],
    })

    const { hash } = await writeContract(config)
    console.log(hash, "hash ");

    return {
        hash
    }
}

export default useContractWriteHook;