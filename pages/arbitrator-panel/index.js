import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import Head from 'next/head';
import ProfileMenu from '../../components/Menus/ProfileMenu';
import { orderService } from '../../services/orderService';
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider';
import { setYubiaiInstance } from '../../providers/orderProvider';
import YubiaiArbitrator from '../../utils/escrow-utils/yubiaiArbitrator';

const ArbitratorPanel = () => {
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const [arbitratorInstance, setArbitratorInstance] = useState(null);
  const [deals, setDeals] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [claimId, setClaimId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initArbitratorInstance = async () => {
      // Since Arbitrator Panel is not included in this release, not important to attach infura server
      const yubiaiArbitratorInstance = new YubiaiArbitrator(
        new Web3(
          process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GOERLI ||
          new Web3.providers.HttpProvider('http://localhost:8545')
        ),
        global?.profile?.eth_address.toLowerCase()
      );
      await yubiaiArbitratorInstance.initContract();
      setArbitratorInstance(yubiaiArbitratorInstance);
    }

    if (!arbitratorInstance) {
      initArbitratorInstance();
    }
  }, [arbitratorInstance]);

  useEffect(() => {
    const loadOrdersBySeller = async () => {
      setWallet(await global.yubiaiPaymentArbitrableInstance.getAccount());
      const result = await orderService.getOrdersBySeller(global?.profile?.eth_address, global?.profile?.token);
      await mapDealsFromOrders(result.data.items);
      setLoaded(true);
    };

    if (!global.yubiaiPaymentArbitrableInstance) {
      setYubiaiInstance(dispatch);
      return;
    }

    if (!deals.length && global.profile && global.yubiaiPaymentArbitrableInstance && !loaded) {
      loadOrdersBySeller();
    }
  }, [deals, global.profile, global.yubiaiPaymentArbitrableInstance]);

  const mapDealsFromOrders = async orders => {
    const dealItems = [];
    for (let order of orders) {
      const transactionIndex = order.transaction.transactionIndex;
      const dealInfo = await global.yubiaiPaymentArbitrableInstance.getDealInfo(transactionIndex);
      const fullStateInfo = await global.yubiaiPaymentArbitrableInstance.getFullStatusOfDeal(transactionIndex);
      dealItems.push({
        ...dealInfo,
        disputeId: fullStateInfo.disputeId,
        transactionIndex
      });
    }
    setDeals([...dealItems]);
  };

  const formatDate = TSDate => {
    const date = new Date(parseInt(TSDate, 10) * 1000);
    return date.toLocaleDateString("es-AR");
  };

  const selectDeal = async deal => {
    setClaimId(deal.disputeId);
  };

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Arbitrator Panel</title>
      </Head>
      <ProfileMenu>
        <h3>Transactions in dispute</h3>
        <p>Selected claim: {claimId}</p>
        <div>
          {
            deals && deals.map((deal, index) => {
              return <Box m="10px 0" onClick={() => selectDeal(deal)} key={`deal-obj-${index}`}>
                <p>ID: {deal.transactionIndex}</p>
                <p>State: {deal.state}</p>
                <p>Buyer: {deal.buyer}</p>
                <p>Current claim: {deal.currentClaim}</p>
                <p>Dispute ID: {deal.disputeId}</p>
                <p>Created at: {formatDate(deal.createdAt)}</p>
              </Box>;
            })
          }
        </div>
        {
          claimId && 
          <div>
            <p>Vote:</p>
            <div>
              <Button onClick={() => arbitratorInstance.voteForClaim(wallet, claimId, 2)}>Win Buyer</Button>
              <Button onClick={() => arbitratorInstance.voteForClaim(wallet, claimId, 1)}>Win Seller</Button>
            </div>
          </div>
        }
      </ProfileMenu>
    </>
  );
}

export default ArbitratorPanel;
