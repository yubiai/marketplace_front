import { Button, Center, Flex, Image, Stack, Text, Box, Spinner, useToast } from '@chakra-ui/react'
import { useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md'
import { profileService } from '../../services/profileService';
import {
  SignInWithLens
} from '@lens-protocol/widgets-react'
import { useRouter } from 'next/router';
import ListBadges from '../Utils/ListBadges';

const MyBadgesCard = ({ dataProfile, token, t, mutate }) => {
  const toast = useToast();
  const router = useRouter();

  const [verifyEnable, setVerifyEnable] = useState(false);

  const [errorVerify, setErrorVerify] = useState(false);

  const [loading, setLoading] = useState(false);

  const [verifyPoh, setVerifyPoh] = useState(false);
  const [verifyLens, setVerifyLens] = useState(false);

  const onVerifyProtocols = () => {
    setVerifyPoh(true);
    setVerifyLens(true);
    if (dataProfile.badges && dataProfile.badges.length > 0) {
      for (let badge of dataProfile.badges) {
        if (badge.protocol == "poh" && badge.status == true) {
          setVerifyPoh(false);
          continue;
        }
        if (badge.protocol == "lens" && badge.status == true) {
          setVerifyLens(false);
          continue;
        }
        continue;
      }
    }
    setVerifyEnable(true);
  }


  const verifyProtocol = async (protocol, accessToken) => {
    setLoading(true);

    let data = {
      protocol: protocol
    }

    if (accessToken) {
      data.accessToken = accessToken
    }

    await profileService
      .verifyProtocol(dataProfile._id, data, token)
      .then((res) => {
        if (res.data.status === false) {
          setErrorVerify(true)
          setLoading(false)
          toast({
            title: t('Failed to verify'),
            description: t('Incorrect validation'),
            position: 'top-right',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
          setVerifyEnable(false);
          mutate()
          return
        }
        setErrorVerify(false)
        toast({
          title: t('Successful verification'),
          description: t('Correct validation'),
          position: 'top-right',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setVerifyEnable(false);
        setLoading(false)
        mutate()
        return
      })
      .catch((err) => {
        console.error(err)
        setLoading(false);
        return
      });

    return
  }

  async function onSignIn(tokens, profile) {
    setLoading(true)

    if (tokens && profile) {
      verifyProtocol("lens", tokens.accessToken);
      return
    }

    setErrorVerify(true);
    setLoading(false);
    return
  }

  const errorLens = () => {
    setLoading(true);
    toast({
      title: t('Failed to verify'),
      description: t('Could not verify with lens protocol'),
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    })
    setLoading(false);
    router.reload();
    return
  }

  if (!dataProfile) return <>No Data</>
  // eslint-disable-next-line react-hooks/rules-of-hooks

  if (loading) return (
    <Center>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="md"
      />
    </Center>
  )

  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={'full'}
          height={{ sm: 'full', md: '20rem' }}
          bg={'white'}
          boxShadow={'2xl'}
          padding={4}
        >
          <Flex>
            <Text mt="5px" fontWeight={600} color={'gray.500'} size="sm">
              {t("My badges")}</Text>
            {!verifyEnable && (
              <Button ml="5px" size='sm' bg="#00ABD1" color="white" variant='solid' onClick={() => onVerifyProtocols()} _hover={{
                bg: "blue.300"
              }}>
                <MdAdd />
              </Button>
            )}
            {verifyEnable && (
              <Button ml="5px" size='sm' bg="orange.700" color="white" variant='solid' onClick={() => setVerifyEnable(false)} _hover={{
                bg: "orange.300"
              }}>
                <MdRemove />
              </Button>
            )}
          </Flex>
          {dataProfile && dataProfile.badges && dataProfile.badges.length === 0 && (
            <Text fontStyle={"italic"}>{t("Empty")}</Text>
          )}
          <Flex ml="1em">
            {dataProfile && dataProfile.badges && dataProfile.badges.length > 0 && <ListBadges badges={dataProfile.badges} />}
          </Flex>
          {errorVerify && (
            <Text mt="1em" color="red">{t("Incorrect validation")}</Text>
          )}
          {verifyEnable && (
            <Box mt="5px">
              <Text mt="5px" fontWeight={600} color={'gray.500'} size="sm">{t("Verifications")}</Text>

              {verifyPoh && (
                <Button mt="1em" rounded={"full"} bg="yellow.700" color="white" size='md'
                  leftIcon={<Image
                    alt="Img Item"
                    height={'28px'}
                    width={'25px'}
                    objectFit={'initial'}
                    src={"/static/images/poh.png"}
                  />} onClick={() => verifyProtocol("poh")}>Proof Of Humanity</Button>
              )}
              {verifyLens && (
                <Box mt="1em">
                  <SignInWithLens size={"large"} theme={"default"} title={"Lens Protocol"}
                    onSignIn={onSignIn} onError={errorLens}
                  />
                </Box>
              )}

              {!verifyPoh && !verifyLens && (
                <>
                  <Text>{t("Already verified everything")}</Text>
                </>
              )}


            </Box>
          )}
        </Stack>
      </Center>
    </>
  )
}

export default MyBadgesCard;
