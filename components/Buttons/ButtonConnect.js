import { Button, useToast } from '@chakra-ui/react'
import { loginMetamask } from '../../utils/ethereum'
import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'

const ButtonConnect = () => {
  const toast = useToast()
  const dispatch = useDispatchGlobal()
  const global = useGlobal()

  const onConnect = async () => {
    const signerAddress = await loginMetamask()

    if (!signerAddress) {
      console.log('Error al iniciar sesion.')
      toast({
        title: 'Failed to login.',
        description: 'Review application',
        position: 'top-right',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    console.log('Address: ', signerAddress)
    const result = await profileService.login(signerAddress)
    console.log(result.data)
    console.log(result.data.token)
    dispatch({
      type: 'AUTHPROFILE',
      payload: result.data,
    })
    localStorage.setItem('YBI-token', result.data.token);
    toast({
      title: 'Login',
      description: 'You have successfully logged in, Welcome!',
      position: 'top-right',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <>
      <Button
        backgroundColor={'white'}
        color={'#00abd1'}
        rounded={'full'}
        ml="1em"
        cursor={'pointer'}
        display={{ base: 'none', md: 'flex' }}
        onClick={() => onConnect()}
      >
        {global.profile ? global.profile.eth_address.substr(0, 8) : "Connect"}
      </Button>
    </>
  )
}

export default ButtonConnect
