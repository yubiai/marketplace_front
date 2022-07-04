import axios from 'axios'

const fetcher = async (url, accessToken) => {
  if(!url){
    let err = {
      status: 403 
    }
    throw err
  }

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
    throw err.response
  })
}

export default fetcher
