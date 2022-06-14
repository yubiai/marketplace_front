import axios from 'axios'
import useSWR from 'swr'

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

export default function useFetch(url, token) {
  console.log(url,"dataa")

  const { data, error } = useSWR([url, token], fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error ? error.message : null,
  }
}
