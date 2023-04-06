import { yubiaiArbitrator } from '../escrow-utils/abis';
import { createWeb3, createWeb3FromModal } from './web3-provider';
import { getContractsForNetwork, getCurrentNetwork } from '../walletUtils';

// Kovan
//const ARBITRATOR_CONTRACT = '0x60B2AbfDfaD9c0873242f59f2A8c32A3Cc682f80';
// ETH
// const ARBITRATOR_CONTRACT = '0x988b3a538b618c7a603e1c11ab82cd16dbe28069';

// Sepolia
const ARBITRATOR_CONTRACT = '0x22545150F189fd2b7C4800625FdB27BDc0463f1C';

export default class Arbitrator {
    constructor(web3Obj, account) {
        this.web3Obj = web3Obj;
        this.account = account;
        this.contractAddress = "";
    }

    async initContract() {
        const web3 = createWeb3((this.web3Obj.currentProvider || {}).url || '');
        this.web3 = await createWeb3FromModal(web3.modal, web3.infuraURL);
        const networkType = getCurrentNetwork()
        const contracts = getContractsForNetwork(networkType.aliasTitle);
        this.contractAddress = contracts.yubiaiArbitrator;
        this.contract = new this.web3.eth.Contract(
            yubiaiArbitrator, ARBITRATOR_CONTRACT, { from: this.account },
        );
    }

    async getAccount() {
        let account;
        try {
            [account] = await this.web3.eth.getAccounts();
        } catch (e) {
            console.log('Error getting accounts from ETH network: ', e);
        }

        if (!account) {
            const web3 = createWeb3((this.web3.currentProvider || {}).url || '')
            this.web3 = await createWeb3FromModal(web3.modal, web3.infuraURL);
        }
        ;[account] = await this.web3.eth.getAccounts()

        return account;
    }

    async disputeStatus(disputeId) {
        return this.contract.methods.disputeStatus(disputeId).call();
    }

    async getDispute(disputeId) {
        return this.contract.methods.getDispute(disputeId).call();
    }

    async getArbitrationCost(extraData) {
        console.log(extraData, "hola aca get arbi cost")
        return this.contract.methods.arbitrationCost(extraData).call();
    }


}