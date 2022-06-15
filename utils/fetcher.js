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
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err)
      throw err.response
    })
}

export default fetcher
