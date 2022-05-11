import { Alert, AlertIcon, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Link from 'next/link';

const MetaAlert = () => {
  const [verifyMeta, setVerifyMeta] = useState(false)

  useEffect(() => {
    const verifyMetamask = () => {
      if (!window.ethereum) {
        console.log('no hay metamask')
        setVerifyMeta(true)
        return null
      }
    }
    verifyMetamask()
    return
  }, [])

  return (
    <>
      {verifyMeta && (
        <Alert status="error">
          <AlertIcon />
          It has been verified that you do not have metamask installed you will not be able to connect.
          <Button ml="1em">
          <Link href="https://metamask.io/download/">Download</Link>
          </Button>
        </Alert>
      )}
    </>
  )
}


export default MetaAlert;