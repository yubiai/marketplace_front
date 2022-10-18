import { Buffer } from 'buffer';
import { createWeb3, createWeb3FromModal } from './web3-provider';
import { erc20, yubiaiArbitrable } from './abis';
import { getContractsForNetwork } from '../walletUtils';

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
        window.web3 = this.web3;
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
      if (token) {
        const tokenContract = new this.web3.eth.Contract(erc20, token, { from: buyer });
        await tokenContract.methods.approve(this.contractAddress, amount).send();
      }

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
      ], termsUrl).send();
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
    async makeClaim(dealId, amount, evidenceURI) {
        return await this.contract.methods.makeClaim(dealId, amount, evidenceURI).send();
    }

    async acceptClaim(claimId) {
        return await this.contract.methods.acceptClaim(claimId).send();
    }

    async challengeClaim(claimId) {
        return await this.contract.methods.challengeClaim(claimId).send();
    }
}