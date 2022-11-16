import { Alert, AlertIcon, Button, Center, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useGlobal } from '../../providers/globalProvider'

const MetaErrorAlert = () => {
  const [infoError, setInfoError] = useState(null)
  const global = useGlobal();

  useEffect(() => {
    const verifyError = () => {
      if (global.autherror) {
        setInfoError(global.autherror);
      } else {
        setInfoError(null);
      }
    }
    verifyError()
    return
  }, [global.autherror])

  return (
    <>
      {infoError && (
        <Alert status="error" w="full">
          <Center ml="1em">
            <AlertIcon />
            {infoError}
            <Link href="https://www.proofofhumanity.id/" isExternal >
              <Button ml="1em">
                Web Proof of humanity
              </Button>
            </Link>
          </Center>
        </Alert>
      )}
    </>
  )
}

export default MetaErrorAlert;
