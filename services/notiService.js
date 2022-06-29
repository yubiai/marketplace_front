import axios from 'axios'



async function updateSeenNotiById(noti_id, token) {

  return await axios.get(`/noti/seen/${noti_id}`, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null)
}

export const notiService = {
    updateSeenNotiById
  }