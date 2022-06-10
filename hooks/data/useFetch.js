import useSWR from "swr"

export default function useFetch (url) {
    const { data, error } = useSWR(url)

    const message = {
      message: "Failed to load"
    }

    return {
      data,
      isLoading: !error && !data,
      isError: error ? message : null
    }
  }