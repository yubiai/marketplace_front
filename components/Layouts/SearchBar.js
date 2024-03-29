import { SearchIcon, CloseIcon } from '@chakra-ui/icons'
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const SearchBar = ({t}) => {
  const router = useRouter()
  const [query, setQuery] = useState("");

  const onSearch = (search) => {
    let verifyChart = search.trim();
    if (verifyChart[0] === "#" || verifyChart[0] === "%" || verifyChart[0] === "&" || verifyChart[0] === "?") {
      verifyChart = verifyChart.substring(1)
      setQuery(verifyChart);
      return
    }
    setQuery(search);
    return
  }

  const handleSearch = () => {
    if (query !== "") {
      router.push(`/search/${query.trim()}`)
    }
  }

  const clearQuery = () => {
    setQuery("")
    router.push("/")
  }

  useEffect(() => {
    const refreshInit = () => {
      if (router.route !== "/search/[query]") {
        setQuery("")
      }
    }
    refreshInit()
  }, [router.route])


  return (
    <>
      <InputGroup backgroundColor={'white'} borderRadius="5px">
        {query && (
          <InputLeftElement
            cursor={'pointer'}
            children={<CloseIcon color="gray.300" w={'0.8em'} h={'0.8em'} />}
            onClick={() => {
              clearQuery()
            }}
          />
        )}
        <Input
          bg="white"
          color="black"
          variant="filled"
          backgroundColor={'white'}
          focusBorderColor={'transparent'}
          size="md"
          placeholder= {t(`Search in Yubiai`)}
          _placeholder={{ color: 'gray.400' }}
          onChange={(e) => onSearch(e.target.value)}
          value={query}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <InputRightElement
          color="gray.300"
          pointerEvents="none"
          justifyContent={'left'}
          fontSize="1.4em"
          children={<>|</>}
        />
        <InputRightElement
          cursor={'pointer'}
          children={<SearchIcon color="gray.300" w={'1.2em'} h={'1.1em'} />}
          onClick={() => {
            handleSearch()
          }}
        />
      </InputGroup>
    </>
  )
}

export default SearchBar
