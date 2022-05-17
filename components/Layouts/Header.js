import Link from 'next/link'
import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  useColorModeValue,
  Show,
  Center,
} from '@chakra-ui/react'
import LenguageChange from '../Menus/LenguageChange'
import DrawerMenu from '../Menus/DrawerMenu'
import SearchBar from './SearchBar'
import ButtonConnect from '../Buttons/ButtonConnect'
import { useGlobal } from '../../providers/globalProvider'

const Header = () => {
  const global = useGlobal()

  return (
    <Box
      bg={useColorModeValue('yb.1', 'peru.700')}
      px={{ base: 'full', md: 4 }}
    >
      <Container maxW="container.xl">
        <Flex
          h={{ base: '100px', md: '12' }}
          alignItems={'center'}
          justifyContent={{ base: 'center', md: 'center', lg: 'space-between' }}
        >
          {/* Logo */}
          <Box display={{ base: 'none', md: 'flex' }} mt={'15px'}>
            <Button
              bg="transparent"
              _hover={{
                bg: '#1C538A',
              }}
            >
              <Link href={'/'}>
                <Image
                  w={'100px'} h={'39.16px'}
                  alt={'Logo'}
                  src={'/static/images/logoyubiai.png'}
                  fallbackSrc={'/static/images/logoyubiai.png'}
                />
              </Link>
            </Button>
          </Box>

          {/* Search */}
          <Center w={{ base: 'full', md: 'md' }} mt={'15px'}>
            <SearchBar />
          </Center>

          {/* Lenguage */}
          <Center mt={'15px'} >
            <LenguageChange />
            {global.meta ? <ButtonConnect /> : ''}
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
