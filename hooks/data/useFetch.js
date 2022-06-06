import useSWR from "swr"

export default function useFetch (url) {
    const { data, error } = useSWR(url)
  
    return {
      data,
      isLoading: !error && !data,
      isError: error
    }
  }