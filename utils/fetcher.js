import axios from 'axios'

const fetcher = async (url, accessToken) => {
  return axios
    .get(
      url,
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : null
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response
    })
}

export default fetcher
