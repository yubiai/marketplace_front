import {
  Box,
  chakra,
  Container,
  Image,
  Stack,
  Link,
  VisuallyHidden,
  Center,
  Button,
  Tooltip,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaTelegramPlane, FaTwitter, FaYoutube } from 'react-icons/fa'
import { SiLinktree } from 'react-icons/si'

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={'blackAlpha.100'}
      rounded={'full'}
      w={12}
      h={12}
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
  const router = useRouter()

  return (
    <Box
      bg={'yb.1'}
      color={'white'}
      position="revert"
      h={{ base: '150px', sm: 'full' }}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={2}
        direction={{ base: 'column', md: 'row' }}
        spacing={3}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Button
          bg="transparent"
          p="1.5em"
          onClick={() => router.push('/')}
          _hover={{
            bg: '#1C538A',
          }}
        >
          <Image
            alt={'Logo'}
            w={'5em'}
            h={'2em'}
            src={'/static/images/logoyubiai.png'}
            fallbackSrc={'/static/images/logoyubiai.png'}
          />
        </Button>
        <Center display={{ base: 'none', md: 'flex' }}>
          <Link mr={'1em'} href="https://gov.proofofhumanity.id/" isExternal>
            Governance Forum
          </Link>
          <Link mr={'1em'} href="https://snapshot.org/#/" isExternal>
            Snapshot
          </Link>
          <Link mr={'1em'} href="https://app.democracy.earth/#/" isExternal>
            UBI Vaults
          </Link>
          <Link mr={'1em'} href="https://court.kleros.io/" isExternal>
            Kleros
          </Link>
        </Center>
        <Stack direction={'row'} spacing={6}>
          <Tooltip label="Twitter">
            <SocialButton
              label={'Twitter'}
              href={'https://twitter.com/YubiaiM'}
            >
              <FaTwitter fontSize={20} />
            </SocialButton>
          </Tooltip>
          <SocialButton label={'Linktree'} href={'https://linktr.ee/Yubiai'}>
            <SiLinktree fontSize={20} />
          </SocialButton>
          <SocialButton label={'Telegram'} href={'https://t.me/yubiai'}>
            <FaTelegramPlane fontSize={25} />
          </SocialButton>
          <SocialButton
            label={'YouTube'}
            href={'https://www.youtube.com/channel/UCbxVCRRIO3xGnZuPywJ_0TA'}
          >
            <FaYoutube fontSize={25} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
