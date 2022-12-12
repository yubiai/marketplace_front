import axios from 'axios'

async function newReport(payload, token) {
  return await axios.post(
    `/report/`, payload,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

export const reportService = {
  newReport
}
