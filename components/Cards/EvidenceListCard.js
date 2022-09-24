import React from 'react';
import { Stack, Text, Button, Image, Center, Box } from '@chakra-ui/react';
import Link from 'next/link';

const EvidenceListCard = ({ evidence }) => {
    console.log(evidence)

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
                    {evidence.title.slice(-20)}...
                </Text>
                </Center>
                <Center w={{base: "100%", md: "15%"}}>
                <Image
                    borderRadius='full'
                    boxSize='30px'
                    src={evidence && evidence.author && evidence.author.photo}
                    alt='Dan Abramov'
                />
                </Center>
                <Box w={{base: "100%", md: "10%"}}>
                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="right">
                    <Link href={`/profile/evidences/${evidence._id}`}>
                    <Button color="green.400" size={"sm"}>View</Button>
                    </Link>
                </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}

export default EvidenceListCard;