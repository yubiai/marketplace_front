import { useEffect, useRef, useState } from 'react'
import { useDispatchGlobal } from './globalProvider'
import KlerosEscrow from '../utils/escrow-utils/kleros-escrow'
import Web3 from 'web3'

const KlerosEscrowProvider = ({ children, transactionData }) => {
  const dispatch = useDispatchGlobal()

  let web3 = new Web3(
    process.env.NEXT_PUBLIC_INFURA_ENDPOINT ||
    new Web3.providers.HttpProvider('http://localhost:8545')
  );

  const klerosEscrowRef = useRef(new KlerosEscrow(web3));
  const [metaEvidenceFileURI, setMetaEvidenceFileURI] = useState("")

  useEffect(() => {
    setMetaEvidenceFileURI(transactionData.fileURI)
    klerosEscrowRef.current.setCourtAndCurrency('general', (transactionData.amount || {}).currency)
    dispatch({
      type: 'SET_KLEROS_ESCROW_INSTANCE',
      payload: klerosEscrowRef.current,
    })
  }, [klerosEscrowRef, dispatch, metaEvidenceFileURI]);

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (transactionData.file) {
        const _metaEvidenceFileURI = `${
          klerosEscrowRef.current.archon.arbitrable.ipfsGateway
        }${await klerosEscrowRef.current.upload(
          'metaEvidenceFile',
          transactionData.file,
        )}`
        if (!cancelled) setMetaEvidenceFileURI(_metaEvidenceFileURI)
      } else if (transactionData.fileURI !== metaEvidenceFileURI)
        setMetaEvidenceFileURI(transactionData.fileURI)
    })()
    return () => (cancelled = true)
  }, [transactionData, metaEvidenceFileURI])

  return <>{children}</>
}

export default KlerosEscrowProvider
