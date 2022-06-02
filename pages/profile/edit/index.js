import { Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import { useGlobal } from '../../../providers/globalProvider'
import { profileService } from '../../../services/profileService'

const ProfileEdit = () => {
  const global = useGlobal()
  const router = useRouter()

  // State useForm
  const { handleSubmit, register, reset } = useForm()

  const [dataProfile, setDataProfile] = useState(null)

  useEffect(() => {
    const initProfile = async () => {
      if (global && global.profile) {
        await profileService.getProfile(global.profile.eth_address).then((res) => {
          const data = res.data;
          setDataProfile(data);
          reset(data)
        })
      } else {
        router.push('/')
      }
    }
    initProfile()
  }, [global, router])

  // Form Submit Preview
  const onSubmit = async (data) => {
    console.log(data, 'dataaa')

    await profileService.updateProfile(global.profile._id, data).then((res) => {
      console.log(res)
      router.push('/profile')
    })
    .catch((err) => {
      console.log(err)
    })
  }

  if (!dataProfile) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Edit My Profile </title>
      </Head>
      <ProfileMenu>
        <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
          <Heading mt="1em">Ediy My Profile</Heading>
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
              {...register('address', { required: true, maxLength: 150 })}
              isRequired
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
