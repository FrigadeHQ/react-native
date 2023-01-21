import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

export function useFrigadeClient() {
  const { publicApiKey, userId, setUserId } = useContext(FrigadeContext)

  return { setUserId, userId, publicApiKey }
}
