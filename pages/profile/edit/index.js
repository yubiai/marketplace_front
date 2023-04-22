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
import useTranslation from 'next-translate/useTranslation';

const ProfileEdit = () => {
  const global = useGlobal()
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation("profedit");
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  // State useForm
  const { handleSubmit, register, formState: { errors }, reset } = useForm()

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
        reset(dataProfile.private_info)
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
    if (data) {
      await profileService
        .updateProfile(global.profile._id, data, global?.profile?.token)
        .then(() => {
          actionToat(t("Profile"), t("Data saved"), "success");
          router.push("/profile")
        })
        .catch((err) => {
          console.error(err)
          actionToat(t("Profile"), t("Data not saved"), "error")
        })
    }
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
              }}>{t("Home")}</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>{t("Profile")}</Text></Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text>{t("Edit")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading mt="1em">{t("Edit my profile")}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text mt="2em">{t("Real Name")}</Text>
            <Input
              color="black"
              placeholder={t("Real Name")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('realname', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Address")}</Text>
            <Input
              color="black"
              placeholder={t("Address")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('address', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("City")}</Text>
            <Input
              color="black"
              placeholder={t("City")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('city', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Country")}</Text>
            <Input
              color="black"
              placeholder={t("Country")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('country', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Telephone")}</Text>
            <Input
              color="black"
              placeholder={t("Telephone")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('telephone', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Email")}</Text>
            <Input
              color="black"
              placeholder={t("Email")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('email', { minLength: 3, maxLength: 150 })}
            />
            <Box float={'right'} m="2em">
              <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.push('/profile')}>
                {t("Go Back")}
              </Button>
              <Button bg="#00abd1" color="white" _hover={{ bg: "blue.300" }} type="submit">
                {t("Save")}
              </Button>
            </Box>
          </form>
        </Container>
      </ProfileMenu>
    </>
  )
}

export default ProfileEdit
