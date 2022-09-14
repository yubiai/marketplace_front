import axios from 'axios'

async function getTermsLast(token) {
  return await axios.get(
    `/terms/`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

export const termService = {
  getTermsLast
}
