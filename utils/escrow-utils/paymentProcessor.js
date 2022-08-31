import { paymentProcessor } from '../escrow-utils/abis';
import { createWeb3, createWeb3FromModal } from './web3-provider'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
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

    async getAdminFee() {
        return await this.contract.methods.getAdminFee().call();
    }

    /**
     * TODO: Include scenario for token-based transactions
     */
    async managePayment(
        amount, paymentId, burnFee, _transferInfo = {}, _transactionData = {}, metaEvidence = '') {
        const metaEvidenceURI = await this.klerosEscrowInstance.prepareSourcesForTransaction(
            amount, _transactionData.receiver, _transactionData.timeoutPayment, metaEvidence, _transferInfo.token);

        const managePaymentPromise = await this.contract.methods.managePayment(
            paymentId,
            burnFee,
            [_transferInfo.token,_transferInfo.tokenETHRate,_transferInfo.ETHPriceGreaterThanToken],
            [_transactionData.sender, _transactionData.timeoutPayment, _transactionData.receiver, metaEvidenceURI]
        )
        if (_transferInfo.token !== NULL_ADDRESS) {
            return managePaymentPromise.send();
        }

        return managePaymentPromise.send({ value: amount });
    }
}
