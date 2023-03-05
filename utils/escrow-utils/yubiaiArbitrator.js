import { Buffer } from 'buffer';
import { createWeb3, createWeb3FromModal } from './web3-provider';
import { yubiaiArbitrator } from './abis';
import { getContractsForNetwork, getCurrentNetwork } from '../walletUtils';

export default class YubiaiArbitrator {
  constructor(web3Obj, account) {
    this.web3Obj = web3Obj;
    this.account = account;
    this.contractAddress = "";
  }

  async initContract() {
    const web3 = createWeb3((this.web3Obj.currentProvider || {}).url || '');
    this.web3 = await createWeb3FromModal(web3.modal, web3.infuraURL);
    const networkType = getCurrentNetwork() // TODO: Reemplazar por walletUtils.getCurrentNetwork ()
    const contracts = getContractsForNetwork(networkType.aliasTitle);
    this.contractAddress = contracts.yubiaiArbitrator;
    this.contract = new this.web3.eth.Contract(yubiaiArbitrator, this.contractAddress, { from: this.account });
    window.contract = this.contract;
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

  async voteForClaim(from, claimId, option = 0) {
    console.log('From : ', from)
    const FIXED_APPEAL = 0;
    console.log(claimId, option, FIXED_APPEAL);
    await this.contract.methods.giveRuling(
        claimId, option, FIXED_APPEAL).send({ from });
    await this.contract.methods.executeRuling(claimId).send({ from });
  }
}