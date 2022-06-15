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
      m="1em"
      size="xl"
    >
      {id}
    </Button>
  )
}

const Paginations = ({ data }) => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()

  const pages = []
  for (let i = 1; i < data?.totalPages + 1; i++) {
    pages.push(<Page id={i} key={i} />)
  }

  const incrPageIndex = () =>
    dispatch({
      type: 'INCRPAGEINDEX',
    })

  const descrPageIndex = () =>
    dispatch({
      type: 'DECRPAGEINDEX',
    })

  return (
    <>
      {data?.totalPages > 1 ? (
        <>
          <Center>
            <Tag m={2} fontWeight="bold">Page: {data?.currentPage + 1}</Tag>
          </Center>
          <Flex alignItems={'center'} justifyContent={{ base: 'center' }}>
            <Button
              onClick={descrPageIndex}
              color="white"
              bg="#00abd1"
              disabled={global.pageIndex <= 0}
            >
              <ArrowLeftIcon w={6} h={6} />
            </Button>
            {pages.length < 20 ? pages : ''}
            <Button
              onClick={incrPageIndex}
              color="white"
              bg="#00abd1"
              disabled={global.pageIndex >= data?.totalPages - 1}
            >
              <ArrowRightIcon w={6} h={6} />
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
