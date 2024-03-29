import ProofOfHumanity from './subgraph/abis/proof-of-humanity.json';
import KlerosLiquid from './subgraph/abis/kleros-liquid.json';
import TransactionBatcher from './subgraph/abis/transaction-batcher.json';
import UBI from './subgraph/abis/ubi.json';
import { getCurrentNetwork } from '../walletUtils';
import {
  UBIAddress,
  address,
  klerosLiquidAddress,
  transactionBatcherAddress,
} from './subgraph/config';

const network = (getCurrentNetwork() || {}).aliasTitle || 'mainnet';

export const contracts = [
    {
      name: 'proofOfHumanity',
      abi: ProofOfHumanity,
      address: { [network]: address },
    },
    {
      name: 'klerosLiquid',
      abi: KlerosLiquid,
      address: { [network]: klerosLiquidAddress },
    },
    { name: 'UBI', abi: UBI, address: { [network]: UBIAddress } },
    {
      name: 'transactionBatcher',
      abi: TransactionBatcher,
      address: { [network]: transactionBatcherAddress },
    },
]