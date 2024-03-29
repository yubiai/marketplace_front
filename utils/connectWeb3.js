import { SiweMessage } from 'siwe';
import { profileService } from '../services/profileService';
import { listChains } from './walletUtils';

async function createSiweMessage(address, statement, chainId) {
    const resNonce = await profileService.nonce();

    if (!resNonce.data) {
        return false;
    }

    const domain = window.location.host;
    const origin = window.location.origin;

    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: chainId,
        nonce: resNonce.data
    });
    return message.prepareMessage();
}

// Crear una firma
async function signInWithEthereum(signer) {
    try {
        const address = await signer.getAddress();
        const message = await createSiweMessage(
            address,
            process.env.NEXT_PUBLIC_SIGN_STATEMENT,
            signer.provider.network.chainId || '1'
        );
        const signature = await signer.signMessage(message);

        const result = {
            message, address, signature
        }
        return result
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Connect wallet si no esta conectado a la app
function connectWallet(provider) {

    return new Promise((resolve, reject) => {
        try {
            const wallet = provider.send('eth_requestAccounts', [])
                .catch(() => {
                    return reject(false)
                });
            return resolve(wallet)
        } catch (err) {
            console.error(err, "err");
            return reject(false)
        }
    })
}


// Verify Network
const verifyNetwork = async () => {
    try {
        const networkVersion = window.ethereum.networkVersion;

        let isNetworkMatched = false;
        for (let i = 0; i < listChains.length; i++) {
            if (listChains[i].id.toString() === networkVersion) {
                isNetworkMatched = true;
                break;
            }
        }

        if (isNetworkMatched) {
            return true;
        }

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: listChains[0].chainID }],
        });

        return "switch";
    } catch (err) {
        console.log(err);
        return false;
    }
};

export { signInWithEthereum, connectWallet, verifyNetwork }
