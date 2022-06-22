import { Button, useToast } from '@chakra-ui/react'
import { loginMetamask } from '../../utils/ethereum'
import { profileService } from '../../services/profileService'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import Cookies from 'js-cookie'

const ButtonConnect = () => {
  const toast = useToast()
  const dispatch = useDispatchGlobal()
  const global = useGlobal()

  const onConnect = async () => {
    const signerAddress = await loginMetamask()

    if (!signerAddress) {
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

    const result = await profileService.login(signerAddress)
    const data = result.data.data;
    dispatch({
      type: 'AUTHPROFILE',
      payload: data
    })
    const yubiaiLS = {
      token: result.data.token,
      wallet: data.eth_address
    }

    Cookies.set('Yubiai', result.data.token, { expires: 1, secure: true })
    localStorage.setItem('Yubiai', JSON.stringify(yubiaiLS))
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
        isDisabled={global.profile && global.profile.eth_address}
      >
        {global.profile && global.profile.eth_address ? global.profile.eth_address.substr(0, 8) : 'Connect'}
      </Button>
    </>
  )
}

export default ButtonConnect
