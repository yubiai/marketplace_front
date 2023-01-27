import { Box, Breadcrumb, BreadcrumbItem, Button, Container, Heading, Input, Text, useToast } from '@chakra-ui/react'
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
import useUser from '../../../hooks/data/useUser'
import Link from 'next/link'
import { ChevronRightIcon } from '@chakra-ui/icons'

const ProfileEdit = () => {
  const global = useGlobal()
  const router = useRouter()
  const toast = useToast()

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  // State useForm
  const { handleSubmit, register, reset } = useForm()

  const {
    data: dataProfile,
    isLoading,
    isError,
  } = useFetch(
    global && global.profile && global.profile._id ? `/profiles/id/${global.profile._id}` : null,
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
        actionToat("Profile", res.data && res.data.message, "success");
        router.push("/profile")
      })
      .catch((err) => {
        console.log(err)
        actionToat("Profile", err.response && err.response.data && err.response.data.message, "error")
      })
  }

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading || !dataProfile) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Edit My Profile </title>
      </Head>
      <ProfileMenu>
        <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
          <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href="/" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>Home</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>Profile</Text></Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text>Edit</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading mt="1em">Edit my profile</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text mt="2em">Real Name</Text>
            <Input
              color="black"
              placeholder="Real Name"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('realname', { maxLength: 150 })}
            />
            <Text mt="2em">Address</Text>
            <Input
              color="black"
              placeholder="Address"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('address', { maxLength: 150 })}
            />
            <Text mt="2em">City</Text>
            <Input
              color="black"
              placeholder="City"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('city', { maxLength: 150 })}
            />
            <Text mt="2em">Country</Text>
            <Input
              color="black"
              placeholder="Country"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('country', { maxLength: 150 })}
            />
            <Text mt="2em">Telephone</Text>
            <Input
              color="black"
              placeholder="Telephone"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('telephone', { maxLength: 150 })}
            />
            <Text mt="2em">Email</Text>
            <Input
              color="black"
              placeholder="Email"
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('email', { maxLength: 150 })}
            />
            <Box float={'right'} m="2em">
              <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.push('/profile')}>
                Go Back
              </Button>
              <Button bg="#00abd1" color="white" _hover={{ bg: "blue.300" }} type="submit">
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
