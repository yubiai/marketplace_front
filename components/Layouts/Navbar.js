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
  Show
} from '@chakra-ui/react'
import UserMenu from '../Menus/UserMenu'
import { useGlobal } from '../../providers/globalProvider'
import { useRouter } from 'next/router'
import NotificationTwo from '../Menus/NotificationTwo'

const Navbar = () => {
  const global = useGlobal()
  const router = useRouter();


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
                        className={navItem.guide}
                        p={2}
                        fontSize={'16px'}
                        bg="transparent"
                        fontWeight={500}
                        color={linkColor}
                        onClick={() => router.push(navItem.href ? navItem.href : '/')}
                        _hover={{
                          textDecoration: 'none',
                          color: linkHoverColor,
                        }}
                      >
                        {navItem.label}
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
      href: '/category/services',
      guide: 'step-category',
      children: [
        {
          label: 'Services',
          href: '/category/services',
        },
      ],
    },
    {
      label: global && global.profile ? 'Sell' : null,
      href: '/listing/new',
      guide: 'step-sell'
    },
    {
      label: global && global.profile ? 'Favourites' : null,
      href: '/profile/favourites',
      guide: 'step-favourites'
    },
    {
      label: 'Help',
      href: '/help',
      guide: 'step-help'
    },
  ]

  return (
    <Show above='md'>
      <Box
        bg={'yb.1'}
        px={4}
        boxShadow={'0px 5px 4px 0px #00000029'}
      >
        <Container maxW="container.xl">
          <Flex color={'black'} minH={'60px'} align={'center'}>
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'center' }}>
              <Flex>
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
              <NotificationTwo />
            </Stack>
          </Flex>
        </Container>
      </Box>
    </Show>
  )
}

export default Navbar
