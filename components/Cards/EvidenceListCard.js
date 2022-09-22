import React from 'react';
import { Stack, Text, Button, Image, Center, Box } from '@chakra-ui/react';

const EvidenceListCard = ({ evidence }) => {

    return (
        <Stack p="4" boxShadow="lg" m="4" borderRadius="sm">
            <Stack
                direction={{ base: 'column', md: 'row' }}
                justifyContent="space-between">
                <Center w={{base: "100%", md: "25%"}}>
                <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
                    Status: {evidence.status}
                </Text>
                </Center>
                <Center w={{base: "100%", md: "50%"}}>
                <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
                    {evidence.title}
                </Text>
                </Center>
                <Center w={{base: "100%", md: "15%"}}>
                <Image
                    borderRadius='full'
                    boxSize='30px'
                    src='https://bit.ly/dan-abramov'
                    alt='Dan Abramov'
                />
                </Center>
                <Box w={{base: "100%", md: "10%"}}>
                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="right">
                    <Button colorScheme="green" size={"sm"}>View</Button>
                </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}

export default EvidenceListCard;