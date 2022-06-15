import { Alert, AlertIcon, Button, Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDispatchGlobal } from '../../providers/globalProvider'

const MetaAlert = () => {
  const [verifyMeta, setVerifyMeta] = useState(false)
  const dispatch = useDispatchGlobal()

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
            It has been verified that you do not have metamask installed you
            will not be able to connect.
            <Button ml="1em">
              <Link href="https://metamask.io/download/">Download</Link>
            </Button>
          </Center>
        </Alert>
      )}
    </>
  )
}

export default MetaAlert
