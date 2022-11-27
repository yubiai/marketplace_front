import kovan from "./kovan";
import mainnet from "./mainnet";
import { getCurrentNetwork } from '../../../walletUtils';

const configs = { kovan, mainnet };

const network = (getCurrentNetwork() || {}).aliasTitle || 'mainnet';

export const {
  address,
  block,
  klerosLiquidAddress,
  UBIAddress,
  transactionBatcherAddress,
  klerosLiquidBlock,
} = configs[network];
