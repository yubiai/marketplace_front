import { Box, Breadcrumb, BreadcrumbItem, Button, Center, Container, Flex, FormControl, FormLabel, Heading, Image, Input, Text, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
import FileUpload from '../../../components/Utils/FileUpload'

const ProfileEdit = () => {
  const global = useGlobal()
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation("profedit");
  const { user, loggedOut } = useUser()
  const [changePhoto, setChangePhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  const [countName, setCountName] = useState(0);
  const MIN_NAME_LENGTH = 3;
  const MAX_NAME_LENGTH = 30;


  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  // State useForm
  const { handleSubmit, register, reset, getValues, control, formState: { errors }, resetField } = useForm()

  const {
    data: dataProfile,
    isLoading,
    isError,
    mutate
  } = useFetch(
    global && global.profile && global.profile._id ? `/profiles/id/${global.profile._id}` : null,
    global && global.profile && global.profile.token
  )

  useEffect(() => {
    const initProfile = () => {
      if (dataProfile) {
        reset(dataProfile)
        setCountName(dataProfile.name.length)
        return
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
      setLoading(true)
      const form = new FormData()

      if (data.file1) {
        form.append('files', data.file1)
      }

      form.append('name', data.name)

      form.append('realname', data.private_info.realname)
      form.append('address', data.private_info.address)
      form.append('city', data.private_info.city)
      form.append('country', data.private_info.country)
      form.append('telephone', data.private_info.telephone)
      form.append('email', data.private_info.email)

      await profileService
        .updateProfile(global.profile._id, form, global?.profile?.token)
        .then(() => {
          mutate()
          actionToat(t("Profile"), t("Data saved"), "success");
          router.push("/profile")
          setLoading(false)
          return
        })
        .catch((err) => {
          console.error(err)
          actionToat(t("Profile"), t("Data not saved"), "error")
          setLoading(false);
          return
        });
    }
  }

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading || !dataProfile || loading) return <Loading />

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
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{t("Photo Perfil")}</FormLabel>
              {changePhoto ? (
                <>
                  <FileUpload
                    name="file1"
                    acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp"
                    isRequired={true}
                    placeholder="Your Photo"
                    control={control}
                    resetField={resetField}
                    getValues={getValues}
                  >
                    {t("Photo Perfil")}
                  </FileUpload>
                  <Button ml="1em" bg="orange.600" color="white" _hover={{ bg: "orange.300" }} onClick={() => setChangePhoto(false)}>{t("Cancel")}</Button>
                </>
              ) : (
                <Center mt="2em">
                  <Flex flex={{ base: 1, md: 0.4 }}>
                    <Image
                      alt="Photo perfil"
                      objectFit="cover"
                      boxSize="100%"
                      borderRadius={'10px'}
                      src={url_fleek + dataProfile.photo}
                      fallbackSrc={"/static/images/userdefault.png"}
                    />
                  </Flex>
                  <Button ml="1em" bg="#00abd1" color="white" _hover={{ bg: "blue.300" }} onClick={() => setChangePhoto(true)}>{t("Change photo")}</Button>
                </Center>
              )}
            </FormControl>
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{"Nick"}</FormLabel>
              <Input
                color="black"
                placeholder={"Nick"}
                _placeholder={{ color: 'gray.400' }}
                bg="white"
                isRequired
                {...register('name', {
                  required: true, minLength: MIN_NAME_LENGTH, maxLength: MAX_NAME_LENGTH, onChange: (e) => { setCountName(e.target.value.length) }
                })}
              />
              <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countName < MIN_NAME_LENGTH || countName > MAX_NAME_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countName}</Text> / {MAX_NAME_LENGTH}</Flex>
              <Text color="red" m="5px">{errors.name?.type === 'pattern' && errors.title?.message}</Text>
              <Text color="red" m="5px">{errors.name?.type === 'required' && t("Title is required")}</Text>
              <Text color="red" m="5px">{errors.name?.type === 'minLength' && t("Minimum required characters are " + MIN_NAME_LENGTH)}</Text>
              <Text color="red" m="5px">{errors.name?.type === 'maxLength' && t("Maximum required characters are " + MAX_NAME_LENGTH)}</Text>
            </FormControl>
            <Text mt="2em">{t("Real Name")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("Real Name")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.realname', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Address")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("Address")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.address', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("City")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("City")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.city', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Country")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("Country")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.country', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Telephone")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("Telephone")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.telephone', { minLength: 3, maxLength: 150 })}
            />
            <Text mt="2em">{t("Email")} ({t("Optional")})</Text>
            <Input
              color="black"
              placeholder={t("Email")}
              _placeholder={{ color: 'gray.400' }}
              bg="white"
              {...register('private_info.email', { minLength: 3, maxLength: 150 })}
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
