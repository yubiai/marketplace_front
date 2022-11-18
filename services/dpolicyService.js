import axios from 'axios'

async function getDPolicyLast(token) {
  return await axios.get(
    `/disputespolicy/`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

export const dpolicyService = {
  getDPolicyLast
}
