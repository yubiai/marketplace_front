import Link from 'next/link'
import { Box, Flex, Button, Container, Image, Center } from '@chakra-ui/react'
import LanguageChange from '../Menus/LanguageChange'
import DrawerMenu from '../Menus/DrawerMenu'
import SearchBar from './SearchBar'
import useTranslation from 'next-translate/useTranslation';
import { ButtonRainbowkit } from '../Buttons/ButtonRainbowKit'

const Header = () => {
  const { t } = useTranslation("navbar");

  return (
    <Box bg={'yb.1'} px={{ base: 'full', md: 4 }}>
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
                boxShadow: '2px 2px 5px black'
              }}
            >
              <Link href={'/'}>
                <Image
                  w={'100px'}
                  h={'39.16px'}
                  alt={'Logo'}
                  src={'/static/images/logoyubiai.png'}
                  fallbackSrc={'/static/images/logoyubiai.png'}
                />
              </Link>
            </Button>
          </Box>

          {/* Search */}
          <Center w={{ base: 'full', md: 'md' }} mt={{ md: '15px' }}>
            <SearchBar t={t} />
            <LanguageChange />
          </Center>

          {/* Language */}
          <Center
            mt={'15px'}
            display={{ base: 'none', md: 'flex' }}
            width="330px">
            {/* <ConnectButton chainStatus="icon" /> */}
            <ButtonRainbowkit />
            {/* Reemplazao de rainbowkit            <ButtonSwitchNetwork bg={"white"} color={'#00abd1'} />
            {global.meta ? <ButtonConnect /> : ''}
       {global.meta ? <ButtonConnectMetamask /> : ''} */}
          </Center>
          <DrawerMenu />
        </Flex>
      </Container>
    </Box>
  )
}

export default Header
