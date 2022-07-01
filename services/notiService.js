import axios from 'axios'

async function getNotiFalseByUserId(userId, token) {
  return await axios.get(
    `/noti/${userId}?size=6&seen=false`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

async function updateSeenNotiById(noti_id, token) {
  return await axios.get(
    `/noti/seen/${noti_id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

export const notiService = {
  getNotiFalseByUserId,
  updateSeenNotiById,
}
