import useSWR from 'swr'
import fetcher from '../../utils/fetcher'

export default function useUser() {
  const YubiaiLs =
    typeof window !== 'undefined' ? localStorage.getItem('Yubiai') : null;
  const Yubiai = YubiaiLs ? JSON.parse(YubiaiLs) : null;

  const { data, error } = useSWR(
    [Yubiai && Yubiai.token ? '/auth/session' : null, Yubiai && Yubiai.token ? Yubiai.token : null],
    fetcher
  )

  const loggedOut = error && error.status === 403 ? true : false

  return {
    user: data,
    loggedOut,
  }
}
