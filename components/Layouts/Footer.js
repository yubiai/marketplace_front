import {
  Box,
  chakra,
  Container,
  Image,
  Stack,
  Link,
  VisuallyHidden,
  Center,
} from '@chakra-ui/react'
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import ShareEmail from './ShareEmail'

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={'blackAlpha.100'}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

const Footer = () => {
  return (
    <Box
      bg={'yb.1'}
      color={'white'}
      zIndex={30}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={3}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Image
          alt={'Logo'}
          w={'5em'}
          h={'2em'}
          src={'/static/images/logoyubiai.png'}
          fallbackSrc={'/static/images/logoyubiai.png'}
        />
        <ShareEmail />
        <Center display={{ base: 'none', md: 'flex' }}>
          <Link mr={"1em"} href="https://gov.proofofhumanity.id/" isExternal>
            Governance Forum
          </Link>
          <Link mr={"1em"} href="https://snapshot.org/#/" isExternal>
            Snapshot
          </Link>
          <Link mr={"1em"} href="https://app.democracy.earth/#/" isExternal>
            UBI Vaults
          </Link>
          <Link mr={"1em"} href="https://court.kleros.io/" isExternal>
            Kleros
          </Link>
        </Center>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Twitter'} href={'https://twitter.com/YubiaiM'}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'YouTube'} href={'/'}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'/'}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
