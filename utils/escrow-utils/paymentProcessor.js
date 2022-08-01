import { paymentProcessor } from '../escrow-utils/abis';
import { createWeb3, createWeb3FromModal } from './web3-provider'

export const PAYMENT_PROCESSOR_CONTRACT = process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_CONTRACT;

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
        window.paymentProcessorContract = this.contract;
    }

    /**
     * TODO: Include scenario for token-based transactions
     */
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
