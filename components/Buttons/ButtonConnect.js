import { Button, useToast } from '@chakra-ui/react'
import { loginMetamask } from '../../utils/ethereum'
import { profileService } from '../../services/profileService'

const ButtonConnect = () => {
  const toast = useToast()

  const onConnect = async () => {
    const signerAddress = await loginMetamask()

    if (!signerAddress) {
      console.log('Error al iniciar sesion.')
      toast({
        title: 'Failed to login.',
        description: 'Review application',
        position: "top-right",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return
    }

    console.log('Address: ', signerAddress)
    const result = await profileService.login(signerAddress)
    console.log(result.data)
    toast({
      title: 'Login',
      description: 'You have successfully logged in, Welcome!',
      position: "top-right",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
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
        Connect
      </Button>
    </>
  )
}

export default ButtonConnect
