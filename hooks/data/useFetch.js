import useSWR from 'swr'
import fetcher from '../../utils/fetcher'

export default function useFetch(url, token) {

  const { data, error, mutate } = useSWR([url, token], fetcher)

  return {
    data,
    isLoading: !data ? true : false,
    isError: error ? error.data : null,
    mutate
  }
}
