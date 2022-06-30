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

const NotiCard = ({item, onClose}) => {
  const router = useRouter()

  const pushLinkAndSee = async() => {
    await notiService.updateSeenNotiById(item._id)
    router.push(`/${item.path}/${item.reference}`)
    onClose()
  }

  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
      onClick={() => pushLinkAndSee("/")} cursor={'pointer'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {item.type}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {item.message}
      </StatNumber>
      <StatHelpText>{moment(item.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</StatHelpText>
    </Stat>
  )
}

export default NotiCard
