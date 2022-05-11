import {
  Box,
  Flex,
  Text,
  Stack,
  Link,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Container
} from '@chakra-ui/react'
import UserAlerts from '../Menus/UserAlerts'
import UserMenu from '../Menus/UserMenu'
import { ChevronRightIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const DesktopNav = () => {
    const linkColor = useColorModeValue('white', 'gray.200')
    const linkHoverColor = useColorModeValue('white.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')

    return (
      <>
        <Stack direction={'row'} spacing={4}>
          {NAV_ITEMS.map((navItem) => (
            <Box key={navItem.label}>
              <Popover trigger={'hover'} placement={'bottom-start'}>
                <PopoverTrigger>
                  <Link
                    p={2}
                    href={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                  >
                    {navItem.label}
                  </Link>
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
          ))}
        </Stack>

      </>
    )
  }

  const DesktopSubNav = ({ label, subLabel }) => {
    return (
      <Link
        href={'/'}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
      >
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'blue.400' }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}
          >
            <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    )
  }

  const NAV_ITEMS = [
    {
      label: 'Categories',
      children: [
        {
          label: 'Services',
          subLabel: 'List Services lorem lorem lorem',
          href: '/category/services',
        },
      ],
    },
    {
      label: 'Sell',
      href: '/sell',
    },
    {
      label: 'Favorites',
      href: '/favorites',
    },
    {
      label: 'Help',
      href: '/help',
    },
  ]

  return (
    <Box bg={useColorModeValue('yb.1', 'gray.900')} px={4}>
      <Container maxW="container.xl">
        <Flex
          color={useColorModeValue('white.600', 'white')}
          minH={'60px'}
          align={'center'}
        >
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
