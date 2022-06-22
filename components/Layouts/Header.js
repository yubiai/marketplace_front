import Link from 'next/link'
import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  Center,
  Text,
} from '@chakra-ui/react'
import LanguageChange from '../Menus/LanguageChange'
import DrawerMenu from '../Menus/DrawerMenu'
import SearchBar from './SearchBar'
import ButtonConnect from '../Buttons/ButtonConnect'
import { useGlobal } from '../../providers/globalProvider'

const Header = () => {
  const global = useGlobal()

  return (
    <Box
      bg={'yb.1'}
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
              p="1.5em"
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
          <Text>
            Test
          </Text>

          {/* Search */}
          <Center w={{ base: 'full', md: 'md' }} mt={{md: '15px'}}>
            <SearchBar />
          </Center>

          {/* Language */}
          <Center mt={'15px'} >
            <LanguageChange />
            {global.meta ? <ButtonConnect /> : ''}
          </Center>
            <DrawerMenu />
        </Flex>
      </Container>
    </Box>
  )
}

export default Header
