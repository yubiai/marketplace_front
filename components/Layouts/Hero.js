import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack
} from '@chakra-ui/react';

const Hero = () => {

    return (
        <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
            rel="stylesheet"
          />
        </Head>
  
        <Container maxW={'3xl'}>
          <Stack
            as={Box}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
              Marketplace <br />
              <Text as={'span'} color={'green.400'}>
               Yubiai
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              lorem lorem              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
              lorem lorem
            </Text>
            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}>
              <Button
                colorScheme={'green'}
                bg={'green.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'green.500',
                }}>
                Get Started
              </Button>
              <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
                Learn more
              </Button>
              <Box>

                <Text
                  fontSize={'lg'}
                  fontFamily={'Caveat'}
                  position={'absolute'}
                  right={'-125px'}
                  top={'-15px'}
                  transform={'rotate(10deg)'}>
                  Yubiai
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </>
    )
}

export default Hero;