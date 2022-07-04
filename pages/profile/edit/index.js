import { Box, Button, Container, Heading, Input, Text, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Error from '../../../components/Infos/Error'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import { useGlobal } from '../../../providers/globalProvider'
import { profileService } from '../../../services/profileService'

const ProfileEdit = () => {
  const global = useGlobal()
  const router = useRouter()
  const toast = useToast()

  // State useForm
  const { handleSubmit, register, reset } = useForm()

  const {
    data: dataProfile,
    isLoading,
    isError,
  } = useFetch(
    global && global.profile && global.profile.eth_address ? `/profiles/${global.profile.eth_address}` : null,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    const initProfile = () => {
      if (dataProfile) {
        reset(dataProfile)
      }
    }
    initProfile()
  }, [dataProfile, reset])

  const actionToat = (title, description, status) => {
    toast({
      title,
      description: description,
      position: 'top-right',
      status: status,
      duration: 5000,
      isClosable: true,
    })
  }

  // Form Submit Preview
  const onSubmit = async (data) => {

    await profileService
      .updateProfile(global.profile._id, data, global?.profile?.token)
      .then((res) => {
        console.log(res)
        actionToat("Profile", res.data && res.data.message , "success")
      })
      .catch((err) => {
        console.log(err)
        actionToat("Profile", err.response && err.response.data && err.response.data.message, "error")
      })
  }

  if ( isLoading || !dataProfile ) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Edit My Profile </title>
      </Head>
      <ProfileMenu>
        <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
          <Heading mt="1em">Edit My Profile</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text mt="2em">Real Name</Text>
            <Input
              placeholder="Real Name"
              bg="white"
              {...register('realname', { maxLength: 150 })}
            />
            <Text mt="2em">Address</Text>
            <Input
              placeholder="Address"
              bg="white"
              {...register('address', { maxLength: 150 })}
            />
            <Text mt="2em">City</Text>
            <Input
              placeholder="City"
              bg="white"
              {...register('city', { maxLength: 150 })}
            />
            <Text mt="2em">Country</Text>
            <Input
              placeholder="Country"
              bg="white"
              {...register('country', { maxLength: 150 })}
            />
            <Text mt="2em">Telephone</Text>
            <Input
              placeholder="Telephone"
              bg="white"
              {...register('telephone', { maxLength: 150 })}
            />
            <Text mt="2em">Email</Text>
            <Input
              placeholder="Email"
              bg="white"
              {...register('email', { maxLength: 150 })}
            />
            <Box float={'right'} m="2em">
              <Button m="2em" onClick={() => router.push('/profile')}>
                Back
              </Button>
              <Button bg="#00abd1" color="white" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </Container>
      </ProfileMenu>
    </>
  )
}

export default ProfileEdit
