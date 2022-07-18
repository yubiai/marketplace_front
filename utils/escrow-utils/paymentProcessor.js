import { paymentProcessor } from '../escrow-utils/abis';
import { createWeb3, createWeb3FromModal } from './web3-provider'

// Kovan
const PAYMENT_PROCESSOR_CONTRACT = '0x12e2A72991FB9AC9Ff97a10f2E1619ee3b96Fc81';
// ETH
// const PAYMENT_PROCESSOR_CONTRACT = '';

export default class PaymentProcessor {
    constructor(web3, account, klerosEscrowInstance) {
      this.fromAccount = account;
      this.initPaymentProcessor(web3, account);
      this.klerosEscrowInstance = klerosEscrowInstance;
    }

    async initPaymentProcessor(web3, account) {
        const _web3 = createWeb3((web3.currentProvider || {}).url || '')
        this.web3 = await createWeb3FromModal(_web3.modal, _web3.infuraURL)
        this.contract = new this.web3.eth.Contract(
            paymentProcessor, PAYMENT_PROCESSOR_CONTRACT, { from: account },
        );
    }

    async managePayment(
        amount, paymentId, burnFee, timeoutPayment, receiver, metaEvidence) {
        const metaEvidenceURI = await this.klerosEscrowInstance.prepareSourcesForTransaction(
            amount, receiver, timeoutPayment, metaEvidence);

        return await this.contract.methods.managePayment(
            amount,
            paymentId,
            burnFee,
            timeoutPayment,
            receiver,
            metaEvidenceURI
        ).send({ value: amount });
    }
}
