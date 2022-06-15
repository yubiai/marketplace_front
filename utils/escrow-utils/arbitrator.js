import { arbitrator } from '../escrow-utils/abis';

// Kovan
const ARBITRATOR_CONTRACT = '0x60B2AbfDfaD9c0873242f59f2A8c32A3Cc682f80';
// ETH
// const ARBITRATOR_CONTRACT = '0x988b3a538b618c7a603e1c11ab82cd16dbe28069';

export default class Arbitrator {
    constructor(web3, account) {
      this.web3 = web3
      this.initArbitrator(account);
    }

    initArbitrator(account) {
        this.contract = new this.web3.eth.Contract(
            arbitrator, ARBITRATOR_CONTRACT, { from: account },
        );
    }

    async disputeStatus(disputeId) {
        return this.contract.methods.disputeStatus(disputeId).call();
    }

    async getDispute(disputeId) {
        return this.contract.methods.getDispute(disputeId).call();
    }
}