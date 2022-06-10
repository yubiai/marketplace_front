import useSWR from 'swr'

export default function useUser() {

  const YubiaiLs = typeof window !== 'undefined' ? localStorage.getItem('Yubiai') : null
  const  Yubiai = YubiaiLs ? JSON.parse(YubiaiLs) : ''

  const { data, error } = useSWR(
    `/profiles/session/${Yubiai.token}`
  )

  const loggedOut = error && error.status === 403 ? true : false


  return {
    user: data,
    loggedOut,
  }
}
