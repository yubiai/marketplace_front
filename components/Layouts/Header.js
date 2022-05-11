import Link from 'next/link'
import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  useColorModeValue,
  Show,
  Center
} from '@chakra-ui/react'
import LenguageChange from '../Menus/LenguageChange'
import DrawerMenu from '../Menus/DrawerMenu'
import SearchBar from './SearchBar'
import ButtonConnect from '../Buttons/ButtonConnect'
import { useGlobal } from '../../providers/globalProvider'

const Header = () => {
  const global = useGlobal();


  return (
    <Box
      bg={useColorModeValue('yb.1', 'peru.700')}
      px={{ base: 'full', md: 4 }}
    >
      <Container maxW="container.xl">
        <Flex
          h={{ base: '100px', md: '16' }}
          alignItems={'center'}
          justifyContent={{ base: 'center', md: 'center', lg: 'space-between' }}
        >
          {/* Logo */}
          <Box width={{ md: '6em' }}>
            <Button
              bg="transparent"
              _hover={{
                bg: '#1C538A',
              }}
            >
              <Link href={'/'}>
                <Image
                  alt={'Logo'}
                  display={{ base: 'none', md: 'flex' }}
                  src={'/static/images/logoyubiai.png'}
                  fallbackSrc={'/static/images/logoyubiai.png'}
                />
              </Link>
            </Button>
          </Box>

          {/* Search */}
          <Center w={'md'}>
            <SearchBar />
          </Center>

          {/* Lenguage */}
          <Center>
            <LenguageChange />
            {global.meta ? <ButtonConnect /> : ""}
          </Center>
          <Show below="md">
            <DrawerMenu />
          </Show>
        </Flex>
      </Container>
     
    </Box>
  )
}

export default Header
