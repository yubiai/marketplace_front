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

async function acceptDPolicyByTransactionHash(payload, token) {
  return await axios.post(
    `/disputespolicy/accept/`, payload, 
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

async function verifyAcceptDPolicy(payload, token) {
  return await axios.put(
    `/disputespolicy/verify/`, payload, 
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
  getDPolicyLast,
  acceptDPolicyByTransactionHash,
  verifyAcceptDPolicy
}
