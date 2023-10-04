import { AttachmentIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderMark,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  useToast
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FilePreviewMini from "../../../../components/Infos/FilePreviewMini";
import AddMessageEvidence from "../../../../components/Modals/AddMessageEvidence";
import PreviewEvidence from "../../../../components/Modals/PreviewEvidence";
import SuccessEvidence from "../../../../components/Modals/SuccessEvidence";
import Loading from "../../../../components/Spinners/Loading";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider";
import { channelService } from "../../../../services/channelService";
import { dpolicyService } from "../../../../services/dpolicyService";
import { evidenceService } from "../../../../services/evidenceService";
import { orderService } from "../../../../services/orderService";
import useTranslation from 'next-translate/useTranslation';
import { ethers } from "ethers";
import { useNetwork, parseEther, useContractWrite } from "wagmi";
import { getContractsForNetwork } from "../../../../utils/walletUtils";
import { yubiaiArbitrable } from "../../../../utils/escrow-utils/abis";

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'audio/mpeg', 'application/pdf'];

const labelStyles = {
  mt: '2',
  ml: '-2.5',
  fontSize: '10px',
};

const NewEvidence = () => {
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const router = useRouter();
  const toast = useToast();
  const { transactionId } = router.query;
  const { t } = useTranslation("evidence")
  const [orderDetail, setOrderDetail] = useState(null);
  const [channelDetail, setChannelDetail] = useState(null);
  const [result, setResult] = useState(null);
  const { user, loggedOut } = useUser();

  const [loadingEnableEditing, setLoadingEnableEditing] = useState(false);

  const [evidenceSave, setEvidenceSave] = useState(null);

  const [valueToClaim, setValueToClaim] = useState(0);
  const [marksToClaim, setMarksToClaim] = useState([]);

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch]);

  const parseWeiToTokenAmount = weiAmount => (ethers.utils.formatEther(weiAmount));

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderByTransaction(
        transactionId, global.profile.token);
      const { data } = response;
      setOrderDetail(data.result);
      console.log(data.result, "data. del load Order")
      loadMsgsByOrderID(data.result);
      const payedAmount = parseInt(data.result.transaction.transactionPayedAmount, 10) || 0;
      setMarksToClaim(generateMarksFromAmount(payedAmount));
      return;
    } catch (err) {
      console.error(err);
      return
    }

  }

  const loadMsgsByOrderID = async (order) => {
    try {
      const channelFind = await channelService.findChannel({
        order_id: order._id
      }, global.profile.token)
      const channel = await channelService.getChannelById(channelFind.data.id, global?.profile?.token)
      if (channel.data && channel.data.messages) {
        setChannelDetail(channel.data)
      }
      return
    } catch (error) {
      console.error(error);
      return
    }
  }

  useEffect(() => {

    async function initial() {
      if (global.profile && !orderDetail) {
        try {
          await dpolicyService.verifyAcceptDPolicy({
            user_id: global.profile._id,
            transactionHash: transactionId
          }, global.profile.token)

          loadOrder();

          return
        } catch (err) {
          console.error(err);
          router.back();
          return
        }
      }
    }

    initial();

  }, [global.profile]);

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // State useForm
  const { handleSubmit, register, formState: { errors }, } = useForm();

  // State Submit
  const [stateSubmit, setStateSubmit] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [dataSubmit, setDataSubmit] = useState(null);

  const [countTitle, setCountTitle] = useState(0);
  const MIN_TITLE_LENGTH = 15;
  const MAX_TITLE_LENGTH = 72;

  const [countDescription, setCountDescription] = useState(0);
  const MIN_DESCRIPTION_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 1600;

  // Input Files
  const inputRef = useRef();
  const [previewFiles, setPreviewFiles] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const generateMarksFromAmount = baseAmount => {
    const minAmount = (baseAmount || 0) / 10;
    const finalArray = [minAmount];
    for (let i = minAmount; i <= baseAmount; i += minAmount) {
      finalArray.push(i);
    }
    return finalArray;
  }

  // Wagmi
  const { chain } = useNetwork()
  const networkType = chain?.name.toLowerCase();
  const yubiaiContract = getContractsForNetwork(networkType);

  // Write Contract
  const { write: makeContractWrite } = useContractWrite({
    address: yubiaiContract.yubiaiArbitrable,
    abi: yubiaiArbitrable,
    functionName: 'makeClaim',
    value: ethers.utils.parseEther(String(process.env.NEXT_PUBLIC_FEE_ARBITRATION)),
    async onSuccess(data) {
        console.log('Success', data)
        setLoadingSubmit(false);
        setStateSubmit(2);
    },
    onError(err) {
      console.error('Error creating a claim for a deal: ', err);
      if (err.code == 4001) {
        setLoadingSubmit(false);
        setStateSubmit(3);
        return
      }
      setLoadingSubmit(false);
      setStateSubmit(2);
    },
})

  const verifyFiles = (e) => {
    if (e.target.files && e.target.files.length === 0) {
      return
    }

    if (previewFiles.length + e.target.files.length > 10) {
      console.error('Maximum files per message is 10')
      setErrorMsg(t('Maximum files per message is 10'))
      return
    }

    const tempArr = [
      ...previewFiles
    ];

    [...e.target.files].forEach((file) => {

      // Verify Exists
      const verifyExists = tempArr.filter(e => e.name == file.name && e.size == file.size)
      if (verifyExists.length > 0) {
        console.error("The file is already added: " + file.name);
        return
      }

      // Verify Type
      const validFileType = fileTypes.find((type) => type === file.type);
      if (!validFileType) {
        console.error('Error: Invalid file type.')
        setErrorMsg(t('Error: Invalid file type.'))
        return
      }

      // Verify Size
      if (file.size > 5e+7) {
        console.error('Error: Limit size.')
        setErrorMsg(t('Error: Limit size.'))
        return
      }

      // Add
      tempArr.push({
        id: file.name.slice(0, 5) + Math.floor(Math.random() * 99999),
        data: file
      });

      setErrorMsg(null)
      return
    });

    setPreviewFiles(tempArr);
    return
  }

  const removeFile = (id) => {

    const result = previewFiles.filter(e => e.id !== id);

    if (!result) {
      return
    }

    setPreviewFiles(result);
    return;
  }

  // Submit
  // Form Submit Preview
  const onSubmit = async (data) => {
    if (!previewFiles.length) {
      console.error('Dispute file is required');
      setErrorMsg(t('Dispute file is required'));
      return;
    }

    if (!selectedMsg.length) {
      console.error('Message is required');
      setErrorMsg(t('Message is required'));
      return;
    }

    const form = new FormData();
    form.append('title', data.title);
    form.append('description', data.description);
    form.append('order_id', orderDetail._id);
    form.append('transactionHash', orderDetail.transaction.transactionMeta.transactionHash);
    form.append('author', global.profile._id);
    form.append('author_address', global.profile.eth_address);
    form.append('value_to_claim', valueToClaim);

    let messages = [];

    for (let msg of selectedMsg) {
      messages.push(msg._id)
    }

    form.append('selectedMsgs', messages)


    for (let file of previewFiles) {
      form.append('files', file.data)
    }

    setDataSubmit(form)
    let newData = JSON.stringify(Object.fromEntries(form))
    newData = JSON.parse(newData)

    setResult(newData)

    onOpen()
    return
  }

  // Confirm Submit
  const confirmSubmit = async () => {

    setLoadingSubmit(true);

    try {
      if (evidenceSave) {
        console.log(evidenceSave.value_to_claim, "valueToClaim")

        manageClaim(
          orderDetail.transaction.transactionIndex,
          String(evidenceSave.value_to_claim),
          evidenceSave.url_ipfs_json,
          orderDetail.transaction.transactionMeta.transactionHash,
          evidenceSave._id
        );

        return
      } else {
        const response = await evidenceService.newEvidence(
          orderDetail.transaction.transactionMeta.transactionHash,
          dataSubmit,
          global.profile.token
        );

        const { result } = response.data;
        setEvidenceSave(result && result._id ? result : null);
          console.log(valueToClaim, "valueToClaim")
        manageClaim(
          orderDetail.transaction.transactionIndex,
          String(valueToClaim),
          result.url_ipfs_json,
          orderDetail.transaction.transactionMeta.transactionHash,
          result._id
        );

        return
      }
    } catch (err) {
      console.log(err, "err");
      setLoadingSubmit(false);
      setStateSubmit(2);
      return
    }
  }

  const manageClaim = async (dealId, amount, evidenceURI, transactionHash, idEvidence) => {
    try {
      console.log(dealId, amount, evidenceURI, transactionHash, idEvidence, "dealId, amount, evidenceURI, transactionHash, idEvidence")
      if (!user.walletAddress) {
        throw "No address"
      }

      //const parsedFeeAmount = yubiaiPaymentArbitrableInstance.web3.utils.toWei(String(process.env.NEXT_PUBLIC_FEE_ARBITRATION));
        amount = ethers.utils.formatEther(amount).toString()
      console.log(amount, "amount")

      makeContractWrite({
        args: [
          dealId, amount, evidenceURI
        ]
      })

      return
      /* const result = await global.yubiaiPaymentArbitrableInstance.makeClaim(
        dealId, amount, evidenceURI, parsedFeeAmount);

      if (result) {
        const fullStatus = await global.yubiaiPaymentArbitrableInstance.getFullStatusOfDeal(dealId);
        await evidenceService.updateStatus(idEvidence, {
          dealId: dealId,
          claimID: fullStatus.claim.claimID,
          status: 1
        }, global?.profile?.token);

        const status = 'ORDER_DISPUTE_RECEIVER_FEE_PENDING';
        await orderService.updateOrderStatus(transactionHash, status, global?.profile?.token);
        router.replace(`/profile/orders/detail/${transactionHash}`);
        return
      } */
    } catch (err) {
      console.error('Error creating a claim for a deal: ', err);
      if (err.code == 4001) {
        setLoadingSubmit(false);
        setStateSubmit(3);
        return
      }
      setLoadingSubmit(false);
      setStateSubmit(2);
      return
    }
  };

  const enableEditing = async () => {
    if (evidenceSave) {
      try {
        setLoadingEnableEditing(true);
        await evidenceService.removeEvidenceOld(evidenceSave._id, global.profile.token);
        setEvidenceSave(null);
        setLoadingEnableEditing(false);
        toast({
          title: 'Editing Form',
          description: 'The form is now editable.',
          position: 'top-right',
          status: 'success',
          duration: 2000,
          isClosable: true
        })
        return
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error editing form',
          description: 'Please review and try again',
          position: 'top-right',
          status: 'warning',
          duration: 2000,
          isClosable: true
        })
        setLoadingEnableEditing(false);
        return
      }
    }
  }

  if (!user || !orderDetail) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - New Evidence</title>
      </Head>
      <Container maxW="2xl" h={'full'} display={'flex'} flexDirection={'column'}>
        <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
          <BreadcrumbItem>
            <Link href="/" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Home")}</Text></Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/profile/orders/" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Orders")}</Text></Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/profile/orders/detail/${orderDetail.transaction.transactionMeta.transactionHash}`}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Order detail")}</Text></Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text>{t("New Evidence")} </Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading mt="1em">{t("Claim transaction")}</Heading>
        <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
          <Box mt="1em">
            <Text fontWeight={600}>{t("Order ID")}</Text>
            <Text>{orderDetail._id}</Text>
            <Text fontWeight={600} mt="5px">{t("Transaction Hash")}</Text>
            <Text>{orderDetail.transaction.transactionMeta.transactionHash}</Text>
          </Box>
          {evidenceSave && (
            <Box mt="1em">
              {loadingEnableEditing ? (
                <Spinner />
              ) : (
                <Button onClick={() => enableEditing()} backgroundColor={'#00abd1'}
                  color={'white'} _hover={{
                    backgroundColor: "blue.400"
                  }}>
                  {t("Enable editing")}
                </Button>
              )}

            </Box>
          )}
          <Box mt="1em">
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{t("Title")}</FormLabel>

              <Input
                placeholder={t("Title Evidence is required")}
                _placeholder={{ color: 'gray.400' }}
                color="gray.700"
                isDisabled={evidenceSave}
                bg="white"
                {...register('title', {
                  required: true, minLength: MIN_TITLE_LENGTH, maxLength: MAX_TITLE_LENGTH, onChange: (e) => { setCountTitle(e.target.value.length) }
                })}
                isRequired
              />
              <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countTitle < MIN_TITLE_LENGTH || countTitle > MAX_TITLE_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countTitle}</Text> / {MAX_TITLE_LENGTH}</Flex>
              <Text color="red" m="5px">{errors.title?.type === 'pattern' && errors.title?.message}</Text>
              <Text color="red" m="5px">{errors.title?.type === 'required' && t("Title is Required")}</Text>
              <Text color="red" m="5px">{errors.title?.type === 'minLength' && t("Minimum required") + " " + MIN_TITLE_LENGTH}</Text>
              <Text color="red" m="5px">{errors.title?.type === 'maxLength' && t("Maximum required") + " " + MAX_TITLE_LENGTH}</Text>
            </FormControl>
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{t("Description")}</FormLabel>
              <Textarea
                placeholder={t("Description Evidence is required")}
                _placeholder={{ color: 'gray.400' }}
                color="gray.700"
                bg="white"
                isDisabled={evidenceSave}
                {...register('description', {
                  required: true, maxLength: MAX_DESCRIPTION_LENGTH, minLength: MIN_DESCRIPTION_LENGTH, onChange: (e) => { setCountDescription(e.target.value.length) }
                })}
                isRequired
              />
              <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countDescription}</Text> / {MAX_DESCRIPTION_LENGTH}</Flex>
              <Text color="red" m="5px">{errors.description?.type === 'pattern' && errors.description?.message}</Text>
              <Text color="red" m="5px">{errors.description?.type === 'required' && t("Description is Required")}</Text>
              <Text color="red" m="5px">{errors.description?.type === 'minLength' && t("Minimum required") + " " + MIN_DESCRIPTION_LENGTH}</Text>
              <Text color="red" m="5px">{errors.description?.type === 'maxLength' && t("Maximum required") + " " + MAX_DESCRIPTION_LENGTH}</Text>
            </FormControl>
            <FormControl>
              <FormLabel color="black">{t("Amount to claim")}</FormLabel>
              {
                orderDetail && orderDetail.item &&
                <p>{parseWeiToTokenAmount(valueToClaim)} {orderDetail.item.currencySymbolPrice}</p>
              }
              <Box textAlign={"center"}>
                <Slider
                  width={{ base: "90%", sm: "90%", md: "100%" }}
                  mt="3em"
                  isDisabled={evidenceSave}
                  aria-label="slider-ex-6"
                  defaultValue={0}
                  color="black"
                  style={{ margin: "10px 0" }}
                  min={0}
                  max={parseInt(orderDetail.transaction.transactionPayedAmount, 10)}
                  onChange={(val) => setValueToClaim(val)}
                >
                  <SliderMark {...labelStyles} value={0}>0</SliderMark>
                  {
                    (marksToClaim && marksToClaim.length) && marksToClaim.map(
                      (wei, index) => {
                        if (index % 2 == 0 && index !== 0) {
                          return <SliderMark {...labelStyles} value={wei} key={`slider-mark-amount-${index}`}>{parseWeiToTokenAmount(wei)}</SliderMark>
                        } else {
                          return null
                        }
                      })
                  }
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </FormControl>
            <Divider />
            <input
              multiple
              type="file"
              accept={fileTypes}
              ref={inputRef}
              name="files"
              onChange={verifyFiles}
              style={{ display: 'none', marginTop: '1em' }}
            />
            <Button mt="3em" bg="gray.500" color="white" isDisabled={evidenceSave}
              _hover={{
                bg: "gray.400"
              }} onClick={() => inputRef.current.click()}
            >
              <AttachmentIcon w={6} h={6} m="4px" /> {t("Attach files*")}
            </Button>
            <Divider />
            <Flex overflowY="auto" width={"full"} mt="1em"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray',
                  borderRadius: '24px',
                },
              }}>
              {previewFiles && previewFiles.length > 0 && previewFiles.map((file, i) => {
                return (
                  <FilePreviewMini file={file} key={i} evidenceSave={evidenceSave} removeFile={removeFile} />
                )
              })}
            </Flex>
            <Divider />
            <AddMessageEvidence channelDetail={channelDetail} selectedMsg={selectedMsg} setSelectedMsg={setSelectedMsg} evidenceSave={evidenceSave} t={t} />
          </Box>
          <Text color="red">{errorMsg && errorMsg}</Text>
          <Box>
            <Box float={'left'} mt="2em">
              <Button color={"black"} _hover={{ bg: "gray.200" }} onClick={() => router.back()}>
                {t("Go Back")}
              </Button>

            </Box>
            <Box float={'right'} mt="2em">
              <Button bg="#00abd1" color="white" type="submit" form="hook-form" _hover={{
                bg: "gray.400"
              }}>
                {t("Preview &amp; Submit")}
              </Button>
            </Box>
          </Box>
        </form>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="5xl"
          scrollBehavior={'inside'}
        >
          {stateSubmit === 0 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalHeader>{t("Review your evidence")}</ModalHeader>
                {loadingSubmit === false && <ModalCloseButton />}
                <ModalBody>
                  {result && orderDetail && (
                    <PreviewEvidence result={result}
                      transactionHash={orderDetail.transaction.transactionMeta.transactionHash}
                      previewFiles={previewFiles}
                      selectedMsg={selectedMsg} t={t} />
                  )}
                </ModalBody>

                <ModalFooter>
                  {loadingSubmit === false && (
                    <>
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        mr={3}
                        onClick={onClose}
                      >
                        {t("Go Back")}
                      </Button>
                      <Button
                        bg="#00abd1"
                        color="white"
                        onClick={() => confirmSubmit()}
                      >
                        {t("Submit")}
                      </Button>
                    </>
                  )}
                  {loadingSubmit === true && (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  )}
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 1 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalBody>
                  <SuccessEvidence />

                </ModalBody>
                <ModalFooter>
                  <Button onClick={() => router.back()}>{t("Close")}</Button>
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 2 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalBody>
                  <Box textAlign="center" py={10} px={6}>
                    <Box display="inline-block">
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        bg={'red.500'}
                        rounded={'50px'}
                        w={'55px'}
                        h={'55px'}
                        textAlign="center">
                        <CloseIcon boxSize={'20px'} color={'white'} />
                      </Flex>
                    </Box>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                      Error
                    </Heading>
                    <Text color={'gray.500'}>
                      {t("Failed to post")}
                    </Text>
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setStateSubmit(0)
                      onClose()
                    }}
                  >
                    {t("Close")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 3 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalBody>
                  <Box textAlign="center" py={10} px={6}>
                    <Box display="inline-block">
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        bg={'red.500'}
                        rounded={'50px'}
                        w={'55px'}
                        h={'55px'}
                        textAlign="center">
                        <CloseIcon boxSize={'20px'} color={'white'} />
                      </Flex>
                    </Box>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                      {t("Operation cancelled")}
                    </Heading>
                    <Text color={'gray.500'}>
                      {t("Failed to metamask")}
                    </Text>
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setStateSubmit(0)
                      onClose()
                    }}
                  >
                    {t("Close")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </>
          )}
        </Modal>
      </Container>
    </>
  )
}

export default NewEvidence;