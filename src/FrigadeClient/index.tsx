import { useContext } from 'react'
import { FrigadeContext } from '../FrigadeProvider'

/**
 * @deprecated use useUser() instead
 */
export function useFrigadeClient() {
  const { publicApiKey, userId, setUserId } = useContext(FrigadeContext)

  return { setUserId, userId, publicApiKey }
}
