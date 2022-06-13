import Link from 'next/link'
import {
  Box,
  Flex,
  Text,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Container,
  Button,
} from '@chakra-ui/react'
import UserAlerts from '../Menus/UserAlerts'
import UserMenu from '../Menus/UserMenu'
import { useGlobal } from '../../providers/globalProvider'

const Navbar = () => {
  const global = useGlobal()

  const DesktopNav = () => {
    const linkColor = 'white'
    const linkHoverColor = 'white'
    const popoverContentBgColor = 'white'

    return (
      <>
        <Stack direction={'row'} spacing={4}>
          {NAV_ITEMS.map((navItem) => {
            if (navItem && navItem.label) {
              return (
                <Box key={navItem.label}>
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Button
                        p={2}
                        fontSize={'16px'}
                        bg="er"
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                          textDecoration: 'none',
                          color: linkHoverColor,
                        }}
                      >
                        <Link href={`${navItem.href ? navItem.href : '/'}`}>
                          {navItem.label}
                        </Link>
                      </Button>
                    </PopoverTrigger>

                    {navItem.children && (
                      <PopoverContent
                        border={0}
                        boxShadow={'xl'}
                        bg={popoverContentBgColor}
                        p={4}
                        rounded={'xl'}
                        minW={'sm'}
                      >
                        <Stack>
                          {navItem.children.map((child) => (
                            <DesktopSubNav key={child.label} {...child} />
                          ))}
                        </Stack>
                      </PopoverContent>
                    )}
                  </Popover>
                </Box>
              )
            }
          })}
        </Stack>
      </>
    )
  }

  const DesktopSubNav = ({ label, href }) => {
    return (
      <Link href={`${href}`}>
        <Button
          role={'group'}
          display={'block'}
          rounded={'md'}
          _hover={{ bg: 'blue.50' }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text transition={'all .3s ease'} fontWeight={500}>
                {label}
              </Text>
            </Box>
          </Stack>
        </Button>
      </Link>
    )
  }

  const NAV_ITEMS = [
    {
      label: 'Categories',
      children: [
        {
          label: 'Services',
          href: '/category/services',
        },
      ],
    },
    {
      label: global && global.profile ? 'Sell' : null,
      href: '/publish/new',
    },
    {
      label: global && global.profile ? 'Favorites' : null,
      href: '/profile/favorites',
    },
    {
      label: 'Help',
      href: '/help',
    },
  ]

  return (
    <Box
      bg={'yb.1'}
      px={4}
      boxShadow={'0px 5px 4px 0px #00000029'}
      display={{ base: 'none', md: 'flex' }}
    >
      <Container maxW="container.xl">
        <Flex color={'black'} minH={'60px'} align={'center'}>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'center' }}>
            <Flex display={{ base: 'none', md: 'flex' }}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'center'}
            direction={'row'}
            spacing={2}
          >
            <UserMenu />
            <UserAlerts />
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
