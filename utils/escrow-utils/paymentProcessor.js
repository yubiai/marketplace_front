import { paymentProcessor } from '../escrow-utils/abis';
import { createWeb3, createWeb3FromModal } from './web3-provider'
import { getContractsForNetwork } from '../walletUtils'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class PaymentProcessor {
    constructor(web3, account, klerosEscrowInstance) {
      this.fromAccount = account;
      this.initPaymentProcessor(web3, account);
      this.klerosEscrowInstance = klerosEscrowInstance;
    }

    async initPaymentProcessor(web3, account) {
        const _web3 = createWeb3((web3.currentProvider || {}).url || '')
        this.web3 = await createWeb3FromModal(_web3.modal, _web3.infuraURL)
        const networkType = await this.web3.eth.net.getNetworkType();
        const contracts = getContractsForNetwork(networkType)

        this.contract = new this.web3.eth.Contract(
            paymentProcessor, contracts.paymentProcessor, { from: account },
        );
        window.paymentProcessorContract = this.contract;
    }

    async getAdminFee() {
        return await this.contract.methods.getAdminFee().call();
    }

    async managePayment(
        amount, paymentId, burnFee, _transferInfo = {}, _transactionData = {}, metaEvidence = '') {
        const metaEvidenceURI = await this.klerosEscrowInstance.prepareSourcesForTransaction(
            amount, _transactionData.receiver, _transactionData.timeoutPayment, metaEvidence, _transferInfo.token);

        if (_transferInfo.token !== NULL_ADDRESS) {
            return await this.contract.methods.manageTokenPayment(
                amount,
                paymentId,
                burnFee,
                [_transferInfo.token, true],
                [_transactionData.sender, _transactionData.timeoutPayment, _transactionData.receiver, metaEvidenceURI]
            ).send();
        }

        return await this.contract.methods.manageETHPayment(
            paymentId,
            burnFee,
            [_transactionData.sender, _transactionData.timeoutPayment, _transactionData.receiver, metaEvidenceURI]
        ).send({ value: amount });
    }
}
