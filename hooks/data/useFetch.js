import useSWR from 'swr'
import fetcher from '../../utils/fetcher'

export default function useFetch(url, token) {

  const { data, error } = useSWR([url, token], fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error ? error.data : null,
  }
}
