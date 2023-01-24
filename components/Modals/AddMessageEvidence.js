import { ChatIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Box,
    Checkbox,
    CheckboxGroup,
    Divider,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ViewMsgFile from "../Cards/ViewMsgFile";
import ViewMsgText from "../Cards/ViewMsgText";

const AddMessageEvidence = ({ channelDetail, selectedMsg, setSelectedMsg }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State useForm
    const { register } = useForm();

    const handleChange = (elements) => {
        let messages = [];

        for (let i = 0; i < elements.length; i++) {
            let result = channelDetail.messages.find((msg) => msg._id === elements[i])
            if (result) {
                messages.push(result);
            }
        }

        setSelectedMsg(messages)
        return
    }

    // Remove Msg Selected
    const removeMsgSelected = (id) => {

        const result = selectedMsg.filter(e => e._id !== id);

        if (!result) {
            return
        }

        setSelectedMsg(result);
        return;
    }

    return (
        <>
            <Button mb="1em" mt="1em" _hover={{
                bg: "gray.400"
            }} onClick={() => {
                onOpen()
            }} bg="green.400" color="white">
                <ChatIcon w={6} h={6} m="4px" /> Add Messages*
            </Button>

            {selectedMsg && selectedMsg.length > 0 && selectedMsg.map((msg, i) => {
                return (
                    <Box key={i}>
                        <Flex>
                            {msg.text && (
                                ViewMsgText(msg)
                            )}
                            {msg.file && (
                                ViewMsgFile(msg)
                            )}
                            <Button bg="transparent" float="right" p="1em" ml="4px" size="15px" onClick={() => removeMsgSelected(msg._id)}>
                                <DeleteIcon fontSize={"1.5em"} />
                            </Button>
                        </Flex>
                        <Divider mt="5px" />
                    </Box>
                )
            })}

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={'inside'}>
                <ModalOverlay />
                <form>

                    <ModalContent>
                        <ModalHeader>Messages</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <CheckboxGroup onChange={handleChange} colorScheme='green'>
                                {channelDetail && channelDetail.messages.length > 0 && (
                                    channelDetail.messages.map((msg, i) => {

                                        if (msg.user === channelDetail.buyer._id) {
                                            msg.user = channelDetail.buyer
                                        }

                                        if (msg.user === channelDetail.seller._id) {
                                            msg.user = channelDetail.seller
                                        }

                                        return (
                                            <Box key={i}>
                                                <Checkbox value={msg._id}  {...register('multiple')}>
                                                    {msg.text && (
                                                        ViewMsgText(msg)
                                                    )}
                                                    {msg.file && (
                                                        ViewMsgFile(msg)
                                                    )}
                                                </Checkbox>
                                            </Box>
                                        )
                                    })
                                )}
                            </CheckboxGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} _hover={{
                                bg: "gray.400"
                            }} onClick={onClose}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}

export default AddMessageEvidence;