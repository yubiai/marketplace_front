import {
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { notiService } from '../../services/notiService'
import { parseNoti } from '../../utils/notiUtils'

const NotiCard = ({ item, onClose, callApiNoti }) => {
  const router = useRouter()

  const pushLinkAndSee = async () => {
    await notiService
      .updateSeenNotiById(item._id)
      .then((res) => {
        console.log(res, 'updateseen')
      })
      .catch((err) => {
        console.log(err, 'error updateseen')
      })

    if (onClose && callApiNoti) {
      setTimeout(() => {
        callApiNoti()
      }, 5000)
      onClose()
    }

    router.push(
      `/${parseNoti(item.type).path ? parseNoti(item.type).path : null}/${
        item.reference
      }`
    )
  }

  return (
    <Stat
      boxShadow="lg"
      m="4"
      maxH={"150px"}
      borderRadius="sm"
      bg="white"
      px={{ base: 4, md: 8 }}
      py={'5'}
      border={item.seen ? null : '1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      onClick={() => pushLinkAndSee('/')}
      cursor={'pointer'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {item.type}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {parseNoti(item.type).message ? parseNoti(item.type).message : null}
      </StatNumber>
      <StatHelpText>
        {moment(item.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
      </StatHelpText>
    </Stat>
  )
}

export default NotiCard
