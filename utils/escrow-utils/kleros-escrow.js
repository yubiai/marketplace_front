
import { Buffer } from 'buffer'

import Archon from '@kleros/archon'

import { erc20, escrow, tokenEscrow } from './abis'
import { ethereumAddressRegExp } from './parsing'
import { createWeb3, createWeb3FromModal } from './web3-provider'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTPLE_ARBITRABLE_CONTRACT = process.env.NEXT_PUBLIC_MULTPLE_ARBITRABLE_CONTRACT;


export default class KlerosEscrow {
  constructor(
    web3,
    archon = new Archon(
      web3.currentProvider,
      `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}`,
    ),
  ) {
    this.web3 = web3
    this.archon = archon
    this.arbitratorContract = '';
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
      this.web3 = await createWeb3FromModal(web3.modal, web3.infuraURL)
    }
    ;[account] = await this.web3.eth.getAccounts()

    return account
  }

  async setCourtAndCurrency(court = 'general', currency) {
    if (!ethereumAddressRegExp.test(court)) {
      let ETHNetID;
      try {
        ETHNetID = await this.web3.eth.net.getId();
      } catch (e) {
        console.error('Error getting id from ETH net: ', e);
        ETHNetID = 42;
      }
      court = MULTPLE_ARBITRABLE_CONTRACT
      this.arbitratorContract = court
    }

    const account = await this.getAccount()

    this.contract = new this.web3.eth.Contract(
      escrow, court, { from: account });

    if (currency) {
      this.tokenContract = new this.web3.eth.Contract(
        erc20, currency, { from: account });
    }
  }

  async upload(fileName, bufferOrJSON) {
    if (typeof bufferOrJSON !== 'string' && !Buffer.isBuffer(bufferOrJSON))
      bufferOrJSON = JSON.stringify(bufferOrJSON)

      const res = await fetch(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          buffer: Buffer.from(bufferOrJSON),
        }),
      });
      const json = await res.json();
      const data = json.data;
      const url = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${data[1].hash}${data[0].path}`; 
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return `/ipfs/${data[1].hash}${data[0].path}`;
  }

  async getTransactions(address) {
    if (!address) address = await this.getAccount()
    const transactionIDs = await this.contract.methods
      .getTransactionIDsByAddress(address)
      .call()
    return Promise.all(
      transactionIDs.map((transactionID) =>
        this.contract.methods.transactions(transactionID).call(),
      ),
    )
  }

  async isSender(transaction = {}) {
    const currentAccount = await this.getAccount();
    return currentAccount.toLowerCase() === transaction.userBuyer.toLowerCase();
  }

  async prepareSourcesForTransaction(amount, recipient, timeout, metaEvidence, tokenAddress='') {
    if (tokenAddress && tokenAddress !== NULL_ADDRESS) {
      await this.tokenContract.methods
        .approve(this.contract.options.address, amount)
        .send();
    }

    if (metaEvidence.file) {
      metaEvidence = { ...metaEvidence }
      metaEvidence.fileURI = await this.upload(
        'metaEvidenceFile',
        metaEvidence.file,
      )
      delete metaEvidence.file
    }

    const sender = await this.getAccount()
    const metaEvidenceURI = await this.upload('metaEvidence.json', {
      ...metaEvidence,
      category: 'Escrow',
      question: 'Which party abided by terms of the contract?',
      rulingOptions: {
        type: 'single-select',
        titles: ['Refund Sender', 'Pay Receiver'],
        descriptions: [
          'Select to return funds to the Sender',
          'Select to release funds to the Receiver',
        ],
      },
      evidenceDisplayInterfaceURI:
        '/ipfs/QmfPnVdcCjApHdiCC8wAmyg5iR246JvVuQGQjQYgtF8gZU/index.html',
      aliases: {
        [sender]: 'sender',
        [recipient]: 'receiver',
      },

      // Non-standard
      amount: this.web3.utils.fromWei(String(amount)),
      arbitrableAddress: this.contract.options.address,
      receiver: recipient,
      sender,
      subCategory: 'General Service',
      timeout,
      token: this.tokenContract && {
        address: this.tokenContract.options.address,
      },
    });

    return metaEvidenceURI;
  }

  async pay(transactionID, amount) {
    return this.contract.methods.pay(transactionID, amount)
      .send()
  }

  reimburse(transactionID, amount) {
    return this.contract.methods.reimburse(transactionID, amount).send()
  }

  async executeTransaction(transactionID) {
    return this.contract.methods.executeTransaction(transactionID).send()
  }

  async timeout(transaction = {}, transactionID) {
    return (await this.isSender(transaction))
      ? this.contract.methods.timeoutBySender(transactionID).send()
      : this.contract.methods.timeoutByReceiver(transactionID).send()
  }

  async payArbitrationFee(transaction = {}, transactionID, amount) {
    return (await this.isSender(transaction))
      ? this.contract.methods
          .payArbitrationFeeBySender(transactionID)
          .send({ value: amount })
      : this.contract.methods
          .payArbitrationFeeByReceiver(transactionID)
          .send({ value: amount })
  }

  async submitEvidence(transactionID, evidence) {
    const evidenceURI = await this.upload('evidence.json', evidence)
    return this.contract.methods
      .submitEvidence(transactionID, evidenceURI)
      .send()
  }
}
