import {
    Container,
    Heading,
    Stack,
    Text,
    Image,
    Box,
    Link,
} from '@chakra-ui/react';

const ComingSoon = () => {

    return (
        <Container w={'full'} h={"100vh"} bg="black">
            <Stack
                textAlign={'center'}
                align={'center'}
                color="white"
                spacing={{ base: 8, md: 10 }}
                >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}>
                    Coming{' '}
                    <Text as={'span'} color={'orange.400'}>
                        Soon          </Text>
                </Heading>
                <Text color={'white'} maxW={'3xl'}>
                    Demo: <Link color="white" href="https://prepro.yubiai.market/">https://prepro.yubiai.market/</Link>
                </Text>
                <Box mt="3em">
                    <Image w={'60%'} src={'/static/images/yubibg.png'}
                        alt='Yubiai' objectFit='cover' />
                </Box>
            </Stack>
        </Container>
    )
}

export default ComingSoon;