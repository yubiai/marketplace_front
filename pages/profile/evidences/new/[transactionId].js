import { AttachmentIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FilePreviewMini from "../../../../components/Infos/FilePreviewMini";
import AddMessageEvidence from "../../../../components/Modals/AddMessageEvidence";
import PreviewEvidence from "../../../../components/Modals/PreviewEvidence";
import SuccessEvidence from "../../../../components/Modals/SuccessEvidence";
import Loading from "../../../../components/Spinners/Loading";
import useUser from "../../../../hooks/data/useUser";
import { useDispatchGlobal, useGlobal } from "../../../../providers/globalProvider"
import { channelService } from "../../../../services/channelService";
import { evidenceService } from "../../../../services/evidenceService";
import { orderService } from "../../../../services/orderService";

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'audio/mpeg', 'application/pdf'];

const NewEvidence = () => {

    const global = useGlobal();
    const dispatch = useDispatchGlobal();
    const router = useRouter();
    const { transactionId } = router.query;

    const [orderDetail, setOrderDetail] = useState(null)
    const [channelDetail, setChannelDetail] = useState(null)
    const [result, setResult] = useState(null)

    const { user, loggedOut } = useUser();

    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch])

    const loadOrder = async () => {

        try {
            const response = await orderService.getOrderByTransaction(
                transactionId, global.profile.token);
            const { data } = response;
            setOrderDetail(data.result)
            loadMsgsByOrderID(data.result)
            return
        } catch (err) {
            console.error(err);
            return
        }

    }

    const loadMsgsByOrderID = async (order) => {
        await channelService.getChannelByOrderId(order._id, global?.profile?.token)
            .then((res) => {
                if (res.data && res.data.messages) {
                    setChannelDetail(res.data)
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        if (global && global.profile) {
            loadOrder()
        }
    }, [global && global.profile])

    //Modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    // State useForm
    const { handleSubmit, register, formState: { errors }, } = useForm()

    // State Submit
    const [stateSubmit, setStateSubmit] = useState(0)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [dataSubmit, setDataSubmit] = useState(null)

    // Input Files
    const inputRef = useRef()
    const [previewFiles, setPreviewFiles] = useState([]);
    const [selectedMsg, setSelectedMsg] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null)

    const verifyFiles = (e) => {

        if (e.target.files && e.target.files.length === 0) {
            return
        }

        if (previewFiles.length + e.target.files.length > 10) {
            console.error('Maximum files per message is 10')
            setErrorMsg('Maximum files per message is 10')
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
                setErrorMsg('Error: Invalid file type.')
                return
            }

            // Verify Size
            if (file.size > 5e+7) {
                console.error('Error: Limit size.')
                setErrorMsg('Error: Limit size.')
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
        console.log(previewFiles, "previewsds removegfile")
        console.log(id, "id removegfile")

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
        const form = new FormData();
        form.append('title', data.title)
        form.append('description', data.description)
        form.append('order_id', orderDetail._id)
        form.append('transactionHash', orderDetail.transaction.transactionHash)
        form.append('author', global.profile._id)
        form.append('author_address', global.profile.eth_address)
        
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
        setLoadingSubmit(true)

        try {
            await evidenceService.newEvidence(orderDetail.transaction.transactionHash,
                dataSubmit,
                global.profile.token
            )

            setLoadingSubmit(false)
            onClose()
            setStateSubmit(1)

            setTimeout(() => {
                onOpen()
            }, 300)
        } catch (err) {
            console.log(err, "err")
            setLoadingSubmit(false)
            setStateSubmit(2)
        }
    }

    if (!user || !orderDetail) return <Loading />

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - New Listing</title>
            </Head>
            <Container maxW="2xl" h={{ base: 'full', md: selectedMsg.length > 0 ? 'full' : '100vh' }} display={'flex'} flexDirection={'column'}>
                <Heading mt="1em">New Evidence</Heading>
                <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                    <Box mt="1em">
                        <Text fontWeight={600}>Order ID</Text>
                        <Text>{orderDetail._id}</Text>
                        <Text fontWeight={600} mt="5px">Transaction Hash</Text>
                        <Text>{orderDetail.transaction.transactionHash}</Text>
                    </Box>
                    <Box mt="1em">
                        <FormControl isRequired mt="1em">
                            <FormLabel color="black">Title</FormLabel>

                            <Input
                                placeholder="Title is required, minimum 15 characters and maximum 72 characters."
                                _placeholder={{ color: 'gray.400' }}
                                color="gray.700"
                                bg="white"
                                {...register('title', { required: true, minLength: 15, maxLength: 72 })}
                                isRequired
                            />
                            <Text color="red" m="5px">{errors.title?.type === 'required' && "Title is Required"}</Text>
                            <Text color="red" m="5px">{errors.title?.type === 'minLength' && "Minimum required characters are 15"}</Text>
                            <Text color="red" m="5px">{errors.title?.type === 'maxLength' && "Maximum required characters are 72"}</Text>
                        </FormControl>
                        <FormControl isRequired mt="1em">
                            <FormLabel color="black">Description</FormLabel>
                            <Textarea
                                placeholder="Description is required, minimum 100 characters and maximum 800 characters"
                                _placeholder={{ color: 'gray.400' }}
                                color="gray.700"
                                bg="white"
                                {...register('description', { required: true, maxLength: 800, minLength: 100 })}
                                isRequired
                            />
                            <Text color="red" m="5px">{errors.description?.type === 'required' && "Description is Required"}</Text>
                            <Text color="red" m="5px">{errors.description?.type === 'minLength' && "Minimum required characters are 100"}</Text>
                            <Text color="red" m="5px">{errors.description?.type === 'maxLength' && "Maximum required characters are 800"}</Text>
                        </FormControl>
                        <Divider />
                        <input
                            multiple
                            type="file"
                            accept={fileTypes}
                            ref={inputRef}
                            name="files"
                            onChange={verifyFiles}
                            style={{ display: 'none' }}
                        />
                        <Button bg="gray.500" color="white" onClick={() => inputRef.current.click()} mt="1em"
                        >
                            <AttachmentIcon w={6} h={6} m="4px" /> Attach files
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
                                    <FilePreviewMini file={file} key={i} removeFile={removeFile} />
                                )
                            })}
                        </Flex>
                        <Divider />
                        <AddMessageEvidence channelDetail={channelDetail} selectedMsg={selectedMsg} setSelectedMsg={setSelectedMsg} />
                    </Box>
                    <Text color="red">{errorMsg && errorMsg}</Text>
                    <Box float={'right'} m="2em">
                        <Button bg="#00abd1" color="white" type="submit" form="hook-form">
                            Preview & Submit
                        </Button>
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
                                <ModalHeader>Review your evidence</ModalHeader>
                                {loadingSubmit === false && <ModalCloseButton />}
                                <ModalBody>
                                    {result && (
                                        <PreviewEvidence result={result} previewFiles={previewFiles} selectedMsg={selectedMsg} />
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
                                                Go Back
                                            </Button>
                                            <Button
                                                bg="#00abd1"
                                                color="white"
                                                onClick={() => confirmSubmit()}
                                            >
                                                Submit
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
                                    <Button onClick={() => router.back()}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </>
                    )}
                    {stateSubmit === 2 && (
                        <>
                            <ModalOverlay />
                            <ModalContent color="gray.700">
                                <ModalBody>Failed to post</ModalBody>
                                <ModalFooter>
                                    <Button
                                        onClick={() => {
                                            setStateSubmit(0)
                                            onClose()
                                        }}
                                    >
                                        Close
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