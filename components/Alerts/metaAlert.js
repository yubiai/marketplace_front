import { Alert, AlertIcon, Button, Center, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useDispatchGlobal } from '../../providers/globalProvider'

const MetaAlert = () => {
  const [verifyMeta, setVerifyMeta] = useState(false)
  const dispatch = useDispatchGlobal()
 // Retirado por rainbowkit
  useEffect(() => {
    const verifyMetamask = () => {
      if (!window.ethereum) {
        setVerifyMeta(true)
        return null
      } else {
        dispatch({
          type: 'VERIFYMETA',
          payload: true,
        })
      }
    }
    verifyMetamask()
    return
  }, [dispatch])

  return (
    <>
      {verifyMeta && (
        <Alert status="error" w="full">
          <Center ml="1em">
            <AlertIcon />
            You do not have MetaMask installed, please install MetaMask and import your ProofOfHumanity wallet so you can connect.
            <Button ml="1em">
              <Link href="https://metamask.io/download/" isExternal>Download</Link>
            </Button>
          </Center>
        </Alert>
      )}
    </>
  )
}

export default MetaAlert
