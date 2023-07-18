import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider'
import { Button, Center, Flex, Tag } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'

const Page = ({ id }) => {
  const dispatch2 = useDispatchGlobal()

  const selectPageIndex = (page) =>
    dispatch2({
      type: 'SELECTPAGEINDEX',
      payload: page,
    })

  return (
    <Button
      color="#00abd1"
      variant="ghost"
      onClick={() => selectPageIndex(id)}
      m="5px"
      size="xl"
      _hover={{
        bg: "gray.300"
      }}
    >
      {id}
    </Button>
  )
}

const Paginations = ({ data }) => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()

  if(!data) return null;

  const pages = []
  for (let i = 1; i < data.totalPages + 1; i++) {
    pages.push(<Page id={i} key={i} />)
  }

  const incrPageIndex = () => {
    window.scrollTo(0, 0)
    dispatch({
      type: 'INCRPAGEINDEX',
    })
  }

  const descrPageIndex = () => {
    window.scrollTo(0, 0)
    dispatch({
      type: 'DECRPAGEINDEX',
    })
  }

  return (
    <>
      {data?.totalPages > 1 ? (
        <>
          <Center>
            <Tag m={2} fontWeight="bold">
               {data?.currentPage + 1}
            </Tag>
          </Center>
          <Flex alignItems={'center'} justifyContent={{ base: 'center' }} width="100%">
            <Button
              onClick={descrPageIndex}
              color="white"
              bg="#00abd1"
              isDisabled={global.pageIndex <= 0}
            >
              <ArrowLeftIcon w={4} h={4} />
            </Button>
            {pages.length < 10 ? pages : ''}
            <Button
              onClick={incrPageIndex}
              color="white"
              bg="#00abd1"
              isDisabled={global.pageIndex >= data.totalPages - 1}
            >
              <ArrowRightIcon w={4} h={4} />
            </Button>
          </Flex>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default Paginations
