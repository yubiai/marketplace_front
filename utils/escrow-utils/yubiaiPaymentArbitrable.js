import { Buffer } from 'buffer';
import { createWeb3, createWeb3FromModal } from './web3-provider';
import { erc20, yubiaiArbitrable } from './abis';
import { getContractsForNetwork } from '../walletUtils';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class YubiaiPaymentArbitrable {
  constructor(web3Obj, account) {
    this.web3Obj = web3Obj;
    this.account = account;
    this.contractAddress = "";
  }

  async initContract() {
    const web3 = createWeb3((this.web3Obj.currentProvider || {}).url || '');
    this.web3 = await createWeb3FromModal(web3.modal, web3.infuraURL);
    const networkType = await this.web3.eth.net.getNetworkType();
    const contracts = getContractsForNetwork(networkType);
    this.contractAddress = contracts.yubiaiArbitrable;
    this.contract = new this.web3.eth.Contract(
        yubiaiArbitrable, this.contractAddress, { from: this.account },
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

    return account
  }

  async upload(fileName, bufferOrJSON) {
      if (typeof bufferOrJSON !== 'string' && !Buffer.isBuffer(bufferOrJSON)) {
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
          }
        });
      }
      return `/ipfs/${data[1].hash}${data[0].path}`;
  }

  /**
   * 1st user case: Create deal
   */
  async createDeal(token, extraBurnFee, timeForService, timeForClaim, buyer, seller, amount, termsUrl) {
    const currentAccount = await this.getAccount();
    if (token) {
      const tokenContract = new this.web3.eth.Contract(erc20, token, { from: buyer });
      await tokenContract.methods.approve(this.contractAddress, amount).send();

      return await this.contract.methods.createDeal([
        amount,
        buyer,
        0,
        extraBurnFee * 100,
        0,
        0,
        seller,
        Math.floor((new Date()).getTime() / 1000),
        timeForService,
        timeForClaim,
        token,
        0,
        0
      ], termsUrl).send({ from: currentAccount });
    }

    return await this.contract.methods.createDealWithValue([
      amount,
      buyer,
      0,
      extraBurnFee * 100,
      0,
      0,
      seller,
      Math.floor((new Date()).getTime() / 1000),
      timeForService,
      timeForClaim,
      token || NULL_ADDRESS,
      0,
      0
    ], termsUrl).send({ value: amount, from: currentAccount });
  }

  /**
   * 2nd user case: Accept deal and pay
   */
  async payDeal(dealId) {
    const currentAccount = await this.getAccount();
    return await this.contract.methods.closeDeal(dealId).send({ from: currentAccount });
  }

    /**
     * 3rd user case: Deal not accepted and requesting a refund
     */
  async makeClaim(dealId, amount, evidenceURI, feeAmount) {
    const currentAccount = await this.getAccount();
    return await this.contract.methods.makeClaim(
      dealId, amount, evidenceURI).send({ value: feeAmount, from: currentAccount });
  }

  async acceptClaim(claimId) {
    const currentAccount = await this.getAccount();
    return await this.contract.methods.acceptClaim(claimId).send({ from: currentAccount });
  }

  async challengeClaim(claimId, feeAmount) {
    const currentAccount = await this.getAccount();
    return await this.contract.methods.challengeClaim(claimId).send({ value: feeAmount, from: currentAccount });
  }

  async isOver(transactionId) {
    return await this.contract.methods.isOver(transactionId).call();
  }

  async getDealInfo(dealId) {
    return await this.contract.methods.deals(dealId).call();
  }

  async getClaimInfo(claimId) {
    return await this.contract.methods.claims(claimId).call();
  }
}