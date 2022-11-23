import {
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { notiService } from '../../services/notiService'
import { parseNoti } from '../../utils/notiUtils'
import { FaRegCommentDots, FaRegComment } from 'react-icons/fa'

const NotiCard = ({ item, onClose, callApiNoti }) => {
  const router = useRouter()

  const pushLinkAndSee = async () => {
    await notiService
      .updateSeenNotiById(item._id)
      .catch((err) => {
        console.log(err, "error update seen")
      })

    if (onClose && callApiNoti) {
      setTimeout(() => {
        callApiNoti()
      }, 5000)
      onClose()
    }

    router.push(
      `/${parseNoti(item.type).path ? parseNoti(item.type).path : null}/${item.reference
      }`
    )
  }

  return (
    <>
      <Flex onClick={() => pushLinkAndSee('/')} p="5px" w="full"  _hover={{
        bg: "gray.100", color: "#00abd1"
      }}
        cursor={'pointer'}>
        <Box mr="5px">
          {item.seen ? <FaRegComment />
            : <FaRegCommentDots />
          }
        </Box>
        <Box>
          <Heading size='xs'>
            {parseNoti(item.type).message ? parseNoti(item.type).message : "No Data"}
          </Heading>
          <Text pt='2' fontSize='sm'>
            {moment(item.createdAt).format('DD MMMM, YYYY h:mm:ss a')}
          </Text>
        </Box>
      </Flex>
    </>
  )
}

export default NotiCard;
