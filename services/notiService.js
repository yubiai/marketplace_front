import axios from 'axios'

// Get Notis By UserId
async function getNotisByUserId(userId, token) {
  return await axios.get(
    `/noti/${userId}?size=4`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

// Get Notis Seen False By UserId
async function getNotisSeenFalseById(user_id, token) {
  return await axios.get(
    `/noti/seen/false/${user_id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

// Update Noti By Id Seen True
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

// Update All Notis With Seen False to True
async function updateNotisAllSeenFalseByUserId(user_id, token) {
  return await axios.put(
    `/noti/seen/all/${user_id}`,
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
  getNotisByUserId,
  updateSeenNotiById,
  getNotisSeenFalseById,
  updateNotisAllSeenFalseByUserId
}
