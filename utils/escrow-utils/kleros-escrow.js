
import { Buffer } from 'buffer'

import Archon from '@kleros/archon'

import { erc20, escrow, tokenEscrow } from './abis'
import { ethereumAddressRegExp } from './parsing'
import { createWeb3, createWeb3FromModal } from './web3-provider'

const ETHCurrencyAddress = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
const tokenAddresses = {
  // Tokens
  42: {
    general: '0xfe4fd3f2d4470fd032ee3e961a981b08e254a0d7',
    'blockchain-non-technical':
      '0xdc73a27c2a81de8646937eac26fa34a870322874',
  },
  1: {
    general: '0xBCf0d1AD453728F75e9cFD4358ED187598A45e6c',
    'blockchain-non-technical':
      '0xC25a0b9681ABF6F090AEd71a8c08fB564b41dab6',
  },
};

const ethAddresses = {
  // ETH
  42: {
    general: '0x23c8118ae9fb45a0cb7fcfe3af65d081233d82a5',
    'blockchain-non-technical':
      '0x01171b3fb9627dd127a6ceb356b4470c492e7a8d', // este contract funciona
  },
  1: {
    general: '0x0d67440946949fe293b45c52efd8a9b3d51e2522',
    'blockchain-non-technical':
      '0xE2Dd8CCe2c33a04215074ADb4B5820B765d8Ed9D',
  },
};

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
      court = (currency ? tokenAddresses : ethAddresses)[ETHNetID][court]
    }

    const account = await this.getAccount()

    this.contract = new this.web3.eth.Contract(
      currency ? tokenEscrow : escrow,
      court,
      {
        from: account,
      },
    )
    this.tokenContract = new this.web3.eth.Contract(
      erc20, currency || ETHCurrencyAddress, { from: account });
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

  async isSender(transactionID) {
    const [account, transaction] = await Promise.all([
      this.getAccount(),
      this.contract.methods.transactions(transactionID).call(),
    ])
    return account === transaction.sender
  }

  async createTransaction(amount, recipient, timeout, metaEvidence) {
    if (this.isNotSetDefaultContract()) {
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
    })

    if (this.isNotSetDefaultContract()) {
      return this.contract.methods
        .createTransaction(
          amount,
          this.tokenContract.options.address,
          timeout,
          recipient,
          metaEvidenceURI,
        )
        .send();
    }
  
    return this.contract.methods
      .createTransaction(timeout, recipient, metaEvidenceURI)
      .send({ value: amount })
  }

  async pay(transactionID, amount) {
    return this.contract.methods.pay(transactionID, amount)
      .send()
  }

  reimburse(transactionID, amount) {
    return this.contract.methods.reimburse(transactionID, amount).send()
  }

  async executeTransaction(transactionID) {
    // const sender = await this.getAccount();
    // console.log('Execute transaction: ', transactionID)

    // { value: 0, from: sender }
    return this.contract.methods.executeTransaction(transactionID).send()
  }

  async timeout(transactionID) {
    return (await this.isSender(transactionID))
      ? this.contract.methods.timeoutBySender(transactionID).send()
      : this.contract.methods.timeoutByReceiver(transactionID).send()
  }

  async payArbitrationFee(transactionID, amount) {
    return (await this.isSender(transactionID))
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

  isNotSetDefaultContract() {
    return this.tokenContract && this.tokenContract._address.toLowerCase() !== ETHCurrencyAddress.toLowerCase();
  }
}
